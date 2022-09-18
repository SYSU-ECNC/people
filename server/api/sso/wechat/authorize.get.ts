import { nanoid } from 'nanoid';
import { useRedis } from '~~/server/lib/storage';

export default defineEventHandler(async (event) => {
  const { redirect } = getQuery(event);
  if (!redirect || Array.isArray(redirect)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const state = nanoid();

  await useRedis().setex(`sso:wechat:${state}:redirect`, 600, redirect);

  const authorizeUrl = new URL(
    'https://open.weixin.qq.com/connect/oauth2/authorize'
  );
  const params = authorizeUrl.searchParams;

  params.append('appid', useRuntimeConfig().wechat.appId);
  params.append(
    'redirect_uri',
    'https://people.ecnc.link/api/sso/wechat/callback'
  );
  params.append('response_type', 'code');
  params.append('scope', 'snsapi_base');
  params.append('state', state);

  authorizeUrl.hash = 'wechat_redirect';

  return {
    authorizeUrl: authorizeUrl.toString(),
  };
});
