import { usePrisma } from "../../lib/storage"
import { verify } from '@node-rs/bcrypt';
import { createSession } from "~~/server/lib/session";

export default defineEventHandler(async (event) => {
  const body = await useBody(event);

  if (!body.netid || !body.password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
    });
  }

  const user = await usePrisma().user.findUnique({ where: {
    netid: body.netid
  }});
  
  if (!user || !user.password) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  const isPasswordVerified = await verify(body.password, user.password);
  if (!isPasswordVerified) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  await createSession(event, user);

  return '';
})
