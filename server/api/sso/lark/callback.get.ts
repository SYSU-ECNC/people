import { useRedis } from '~~/server/lib/storage';
import { larkClient } from '~/server/lib/lark';

interface LarkAccessTokenResponse {
  code: number;
  msg: string;
  data: {
    open_id: string;
    union_id: string;
  };
}

export default defineEventHandler(async (event) => {
  const { code, state } = getQuery(event);

  if (!code || Array.isArray(code) || !state || Array.isArray(state)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const redirect = await useRedis().get(`sso:lark:${state}:redirect`);
  if (!redirect) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      data: {
        message: 'state is invalid or expired.',
      },
    });
  }

  const accessTokenUrl = new URL(
    'https://open.feishu.cn/open-apis/authen/v1/access_token'
  );
  const params = accessTokenUrl.searchParams;
  params.append('code', code);
  params.append('grant_type', 'authorization_code');

  const response = await $fetch<LarkAccessTokenResponse>(
    accessTokenUrl.toString(),
    {
      headers: {
        authorization: `Bearer ${larkClient.tokenManager.getCustomTenantAccessToken()}`,
      },
      parseResponse: JSON.parse,
    }
  );
  if (response.code) {
    console.error('larkAccessToken error', response);
    const redirectUrl = new URL(redirect, 'https://people.ecnc.link/');
    redirectUrl.searchParams.set(
      'error',
      '获取飞书用户信息时发生错误，请重试。'
    );
    return sendRedirect(event, redirectUrl.toString(), 302);
  }

  const unionId = response.data.union_id;
  await useRedis().setex(`sso:wechat:${state}:unionId`, 600, unionId);

  const redirectUrl = new URL(redirect, 'https://people.ecnc.link/');
  redirectUrl.searchParams.set('state', state);

  return sendRedirect(event, redirectUrl.toString(), 302);
});
