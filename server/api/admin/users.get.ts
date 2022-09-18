import { usePrisma } from '../../lib/storage';
import { useSession } from '~~/server/lib/session';

export default defineEventHandler(async (event) => {
  const session = await useSession(event);

  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    });
  }

  return await usePrisma().user.findMany({
    select: {
      id: true,
      netid: true,
      name: true,
      studentId: true,
      larkUnionId: true,
      wechatOpenId: true,
    },
  });
});
