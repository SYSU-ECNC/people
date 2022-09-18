import { createError } from 'h3';
import { useSession } from '~~/server/lib/session';

export default defineEventHandler(async (event) => {
  const session = await useSession(event);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  return session;
});
