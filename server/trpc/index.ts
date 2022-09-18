import { createHmac } from 'node:crypto';
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
  .query('loginToDiscourse', {
    input: z.object({
      state: z.string(),
    }),
    async resolve({ ctx, input: { state } }) {
      if (!ctx.session) {
        throw new trpc.TRPCError({
          code: 'UNAUTHORIZED',
          message: '认不出你',
        });
      }

      const nonce = await useRedis().get(`sso:discourse:${state}:nonce`);
      const redirect = await useRedis().get(`sso:discourse:${state}:redirect`);
      if (!nonce || !redirect) {
        throw new trpc.TRPCError({
          code: 'BAD_REQUEST',
          message: '找不到回去的路了，请再试下吧',
        });
      }

      const { netid } = ctx.session;

      const user = await usePrisma().user.findUnique({
        where: {
          netid,
        },
      });
      if (!user) {
        throw new trpc.TRPCError({
          code: 'INTERNAL_SERVER_ERROR',
          message: '用户数据出了点错',
        });
      }

      const payload = new URLSearchParams({
        nonce,
        email: user.email,
        external_id: netid,
        username: user.name,
        name: user.name,
        suppress_welcome_message: 'true',
      });
      const encodedPayload = Buffer.from(payload.toString()).toString('base64');

      const hmac = createHmac('sha256', useRuntimeConfig().discourse.secret);
      hmac.update(encodedPayload);
      const sig = hmac.digest('hex');

      const redirectUrl = new URL(redirect);
      redirectUrl.searchParams.set('sso', encodedPayload);
      redirectUrl.searchParams.set('sig', sig);

      return redirectUrl.toString();
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
