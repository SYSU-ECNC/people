import { createError } from 'h3';
import { hydraAdmin } from '@/server/lib/hydra';
import { useSession } from '@/server/lib/session';

export default defineEventHandler(async (event) => {
  const { login_challenge: loginChallenge } = getQuery(event);

  if (!loginChallenge || Array.isArray(loginChallenge)) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const session = await useSession(event);
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const { data } = await hydraAdmin.acceptLoginRequest(loginChallenge, {
    subject: session.netid,
    remember: false,
  });

  await sendRedirect(event, data.redirect_to, 302);
});
