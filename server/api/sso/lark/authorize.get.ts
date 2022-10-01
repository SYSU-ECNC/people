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

  await useRedis().setex(`sso:lark:${state}:redirect`, 600, redirect);

  const authorizeUrl = new URL(
    'https://open.feishu.cn/open-apis/authen/v1/index'
  );
  const params = authorizeUrl.searchParams;
  params.append('app_id', useRuntimeConfig().lark.appId);
  params.append(
    'redirect_uri',
    'https://people.ecnc.link/api/sso/lark/callback'
  );
  params.append('state', state);

  return {
    authorizeUrl: authorizeUrl.toString(),
  };
});
