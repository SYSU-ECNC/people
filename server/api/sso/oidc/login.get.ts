import { createError } from 'h3';
import { hydraAdmin } from '@/server/lib/hydra';

export default defineEventHandler(async (event) => {
  const { login_challenge: loginChallenge } = getQuery(event);

  if (!loginChallenge || Array.isArray(loginChallenge)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const { status } = await hydraAdmin.getLoginRequest(loginChallenge);
  if (status !== 200) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
    });
  }

  await sendRedirect(
    event,
    `/sso/login?redirect=` +
      encodeURIComponent(
        'https://people.ecnc.link/api/sso/oidc/callback?login_challenge=' +
          loginChallenge
      ),
    302
  );
});
