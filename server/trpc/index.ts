import { verify } from '@node-rs/bcrypt';
import * as trpc from '@trpc/server';
import { z } from 'zod';
import { usePrisma, useRedis } from '../lib/storage';
import { createSession, deleteSession } from '../lib/session';

import type { Context } from './context';

export { createContext } from './context';

interface KratosSession {
  identity: {
    traits: {
      name: string;
      netid: string;
    };
  };
}

export const router = trpc
  .router<Context>()
  .query('getSession', {
    resolve({ ctx: { session } }) {
      if (!session) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
          message: '您可能尚未登录，或者登录状态已经过期。',
        });
      }

      return session;
    },
  })
  .mutation('loginByPassword', {
    input: z.object({
      netid: z.string(),
      password: z.string(),
    }),
    async resolve({ ctx, input: { netid, password } }) {
      const user = await usePrisma().user.findUnique({
        where: {
          netid,
        },
      });

      if (!user || !user.password) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
          message: 'NetID 或密码错误。',
        });
      }

      const isPasswordVerified = await verify(password, user.password);
      if (!isPasswordVerified) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
          message: 'NetID 或密码错误',
        });
      }

      await createSession(ctx.event, user);
    },
  })
  .query('loginByWechat', {
    input: z.object({
      state: z.string(),
    }),
    async resolve({ ctx, input: { state } }) {
      const openId = await useRedis().get(`sso:wechat:${state}:openid`);
      if (!openId) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: '获取微信 OpenID 时发生错误，请重试。',
        });
      }

      const user = await usePrisma().user.findUnique({
        where: {
          wechatOpenId: openId,
        },
      });

      if (!user) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
          message: '该微信账号尚未绑定 ECNC 账号，请使用其他登录方式。',
        });
      }

      await createSession(ctx.event, user);
    },
  })
  .query('linkWechat', {
    input: z.object({
      state: z.string(),
    }),
    async resolve({ ctx, input: { state } }) {
      const kratosSession = await $fetch<KratosSession>(
        'https://accounts.ecnc.link/kratos/sessions/whoami',
        {
          headers: {
            cookie: getRequestHeader(ctx.event, 'cookie'),
          },
        }
      ).catch((err) => {
        console.error(err);

        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
          message: '获取 ECNCbeta 用户身份时发生错误，请重试。',
        });
      });

      const openId = await useRedis().get(`sso:wechat:${state}:openid`);
      if (!openId) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: '获取微信用户身份时发生错误，请重试。',
        });
      }

      await usePrisma().user.update({
        where: {
          netid: kratosSession.identity.traits.netid,
        },
        data: {
          wechatOpenId: openId,
        },
      });
    },
  })
  .mutation('logout', {
    async resolve({ ctx }) {
      if (!ctx.session) {
        return;
      }

      await deleteSession(ctx.event);
    },
  });
