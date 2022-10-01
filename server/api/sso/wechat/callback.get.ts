import { useRedis } from '~~/server/lib/storage';

type WeChatAccessTokenResponseBody = {
  access_token: string;
  expires_in: number;
  refresh_token: string;
  openid: string;
  scope: string;
};
type WeChatAccessTokenResponseError = {
  errcode: string;
  errmsg: string;
};
type WeChatAccessTokenResponse =
  | WeChatAccessTokenResponseBody
  | WeChatAccessTokenResponseError;

export default defineEventHandler(async (event) => {
  const { code, state } = getQuery(event);

  if (!code || Array.isArray(code) || !state || Array.isArray(state)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const redirect = await useRedis().get(`sso:wechat:${state}:redirect`);
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
    'https://api.weixin.qq.com/sns/oauth2/access_token'
  );
  const params = accessTokenUrl.searchParams;

  const { appId, appSecret } = useRuntimeConfig().wechat;
  params.append('appid', appId);
  params.append('secret', appSecret);
  params.append('code', code);
  params.append('grant_type', 'authorization_code');

  const response = await $fetch<WeChatAccessTokenResponse>(
    accessTokenUrl.toString(),
    {
      parseResponse: JSON.parse,
    }
  );
  if ('errcode' in response) {
    console.error('wechatAccessToken error', response);
    const redirectUrl = new URL(redirect, 'https://people.ecnc.link/');
    redirectUrl.searchParams.set(
      'error',
      '获取微信用户信息时发生错误，请重试。'
    );
    return sendRedirect(event, redirectUrl.toString(), 302);
  }

  const openId = response.openid;
  await useRedis().setex(`sso:wechat:${state}:openid`, 600, openId);

  const redirectUrl = new URL(redirect, 'https://people.ecnc.link/');
  redirectUrl.searchParams.set('state', state);
  redirectUrl.searchParams.set('from', 'wechat');

  return sendRedirect(event, redirectUrl.toString(), 302);
});
