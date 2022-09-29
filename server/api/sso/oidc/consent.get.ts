import { createError } from 'h3';
import { hydraAdmin } from '@/server/lib/hydra';
import { useSession } from '@/server/lib/session';

export default defineEventHandler(async (event) => {
  const { consent_challenge: consentChallenge } = getQuery(event);

  if (!consentChallenge || Array.isArray(consentChallenge)) {
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

  const { data: consentRequest } = await hydraAdmin.getConsentRequest(
    consentChallenge
  );
  if (consentRequest.subject !== session.netid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const {
    data: { redirect_to: redirectTo },
  } = await hydraAdmin.acceptConsentRequest(consentChallenge, {
    grant_scope: consentRequest.requested_scope,
    grant_access_token_audience: consentRequest.requested_access_token_audience,
    remember: true,
    remember_for: 0,
    session: {
      id_token: {
        sub: session.netid,
        netid: session.netid,
        name: session.name,
        nickname: session.name,
        email: `${session.netid}@ecnc.link`,
        level: session.level,
      },
    },
  });

  await sendRedirect(event, redirectTo, 302);
});
