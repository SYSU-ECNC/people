import * as trpc from '@trpc/server';
import { z } from 'zod';
import { hash } from '@node-rs/bcrypt';
import smCrypto from 'sm-crypto';
import { Context } from './context';
import { usePrisma, useRedis } from '~/server/lib/storage';
import { larkClient } from '~/server/lib/lark';

async function getUserFromEncryptedNetid(encryptedNetid: string) {
  const netid = smCrypto.sm4.decrypt(
    encryptedNetid,
    useRuntimeConfig().welcomeSecret
  );

  const user = await usePrisma().user.findUnique({ where: { netid } });
  if (!user) {
    throw new trpc.TRPCError({
      code: 'UNAUTHORIZED',
      message: '认不出你',
    });
  }

  return user;
}

function getWelcomeCardContent(larkUnionId: string) {
  return JSON.stringify({
    config: { wide_screen_mode: true },
    elements: [
      {
        tag: 'div',
        text: {
          content: `亲爱的 <at id=${larkUnionId}></at> 同学，祝贺你成功成为 ECNC 的一员！\n在此，网络中心全体学生网管对你表示欢迎，欢迎加入网络中心这个大集体。`,
          tag: 'lark_md',
        },
      },
      {
        tag: 'action',
        actions: [
          {
            tag: 'button',
            text: { content: '🙋 立刻查看欢迎信', tag: 'lark_md' },
            type: 'primary',
            url: useRuntimeConfig().lark.welcomeLetterLink,
          },
        ],
      },
      {
        tag: 'note',
        elements: [
          {
            tag: 'plain_text',
            content:
              '提醒：请认真对照欢迎信中的要求，在规定时间内完成入职所需的流程。',
          },
        ],
      },
    ],
    header: {
      template: 'blue',
      title: { content: '👋 欢迎你加入 ECNC', tag: 'plain_text' },
    },
  });
}

export const router = trpc
  .router<Context>()
  .query('isInvited', {
    input: z.object({
      encryptedNetid: z.string(),
    }),

    async resolve({ input: { encryptedNetid } }) {
      const netid = encryptedNetid;

      const user = await usePrisma().user.findUnique({ where: { netid } });
      if (!user) {
        return false;
      }

      return true;
    },
  })
  .query('userInfo', {
    input: z.object({
      encryptedNetid: z.string(),
    }),

    async resolve({ input: { encryptedNetid } }) {
      const user = await getUserFromEncryptedNetid(encryptedNetid);

      return {
        netid: user.netid,
        name: user.name,
        studentId: user.studentId,
        school: user.school,
        dorm: user.dorm,
        grade: user.grade,
        graduateYear: user.graduateYear,
        phone: user.phone,
        email: user.email,
      };
    },
  })
  .query('bindWechat', {
    input: z.object({
      encryptedNetid: z.string(),
      state: z.string(),
    }),
    async resolve({ input: { encryptedNetid, state } }) {
      const user = await getUserFromEncryptedNetid(encryptedNetid);

      const openId = await useRedis().get(`sso:wechat:${state}:openid`);
      if (!openId) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: '获取微信 OpenID 时发生错误，请重试。',
        });
      }

      await usePrisma().user.update({
        where: {
          netid: user.netid,
        },
        data: {
          wechatOpenId: openId,
        },
      });
    },
  })
  .mutation('updatePassword', {
    input: z.object({
      encryptedNetid: z.string(),
      password: z
        .string()
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/
        ),
    }),
    async resolve({ input }) {
      const user = await getUserFromEncryptedNetid(input.encryptedNetid);

      await usePrisma().user.update({
        where: {
          netid: user.netid,
        },
        data: {
          password: await hash(input.password),
          passwordVersion: '2',
        },
      });
    },
  })
  .mutation('updateUserInfo', {
    input: z.object({
      encryptedNetid: z.string(),
      dorm: z.string(),
      grade: z.string(),
      graduateYear: z.string().regex(/202\d/),
      phone: z.string().regex(/1\d{10}/),
      email: z.string().email(),
    }),
    async resolve({ input }) {
      const user = await getUserFromEncryptedNetid(input.encryptedNetid);

      await usePrisma().user.update({
        where: {
          netid: user.netid,
        },
        data: {
          dorm: input.dorm,
          grade: input.grade,
          graduateYear: input.graduateYear,
          phone: input.phone,
          email: input.email,
        },
      });
    },
  })
  .query('isLarkActive', {
    input: z.object({
      encryptedNetid: z.string(),
    }),
    async resolve({ input: { encryptedNetid } }) {
      const user = await getUserFromEncryptedNetid(encryptedNetid);
      return !!user.larkUnionId;
    },
  })
  .mutation('createLarkAccount', {
    input: z.object({
      encryptedNetid: z.string(),
    }),
    async resolve({ input: { encryptedNetid } }) {
      const user = await getUserFromEncryptedNetid(encryptedNetid);

      const result = await larkClient.contact.user
        .create({
          data: {
            user_id: user.netid,
            name: user.name,
            mobile: user.phone,
            department_ids: ['StudentAssistant'],
            employee_type: 1,
            employee_no: user.netid,
            enterprise_email: `${user.netid}@ecnc.link`,
            custom_attrs: [
              {
                type: 'TEXT',
                id: 'C-6955322486502195228',
                value: {
                  text: user.studentId,
                },
              },
              {
                type: 'TEXT',
                id: 'C-6955322614017458203',
                value: {
                  text: user.school ?? '',
                },
              },
              {
                type: 'TEXT',
                id: 'C-6955320157275176961',
                value: {
                  text: user.netid,
                },
              },
              {
                type: 'TEXT',
                id: 'C-6955320157283581980',
                value: {
                  text: user.dorm ?? '',
                },
              },
            ],
          },
          params: {
            department_id_type: 'department_id',
          },
        })
        .catch((error) => {
          throw new trpc.TRPCError({
            code: 'INTERNAL_SERVER_ERROR',
            message: `LARK API ERROR: ${error.code} - ${error.msg}`,
          });
        });

      await usePrisma().user.update({
        where: {
          netid: user.netid,
        },
        data: {
          larkUnionId: result.data?.user?.union_id,
        },
      });

      await larkClient.im.message.create({
        data: {
          receive_id: user.netid,
          content: getWelcomeCardContent(user.netid),
          msg_type: 'interactive',
        },
        params: {
          receive_id_type: 'user_id',
        },
      });
    },
  });
