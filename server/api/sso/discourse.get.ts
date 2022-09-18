import { createHmac } from 'node:crypto';
import { createError } from 'h3';
import { nanoid } from 'nanoid';
import { useRedis } from '~~/server/lib/storage';

export default defineEventHandler(async (event) => {
  const { sso, sig } = getQuery(event);

  if (!sso || Array.isArray(sso) || !sig || Array.isArray(sso)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const hmac = createHmac('sha256', useRuntimeConfig().discourse.secret);
  hmac.update(sso);
  const calculatedSig = hmac.digest('hex');

  if (calculatedSig !== sig) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const decodedParams = Buffer.from(sso, 'base64').toString('utf-8');
  const params = new URLSearchParams(decodedParams);

  const nonce = params.get('nonce');
  const redirect = params.get('return_sso_url');
  if (!nonce || !redirect) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const state = nanoid();
  await useRedis().setex(`sso:discourse:${state}:nonce`, 600, nonce);
  await useRedis().setex(`sso:discourse:${state}:redirect`, 600, redirect);

  await sendRedirect(
    event,
    `/sso/login?redirect=` +
      encodeURIComponent('/sso/discourse?state=' + state),
    302
  );
});
