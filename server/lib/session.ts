import type { H3Event } from 'h3';
import { nanoid } from 'nanoid';
import { User } from '@prisma/client';
import { useRedis } from './storage';

export interface Session {
  netid: string;
  ip: string;
  userAgent: string;
  createdAt: Date;
  lastSeenAt: Date;
}

function getRealIp(event: H3Event) {
  return event.req.socket.remoteAddress;
}

function getUserAgent(event: H3Event) {
  const userAgentHeader = getHeader(event, 'User-Agent');
  if (Array.isArray(userAgentHeader)) {
    return userAgentHeader[0];
  }

  return userAgentHeader;
}

export const useSession = async (event: H3Event) => {
  const sessionId = getCookie(event, useRuntimeConfig().session.cookieName);
  if (!sessionId) {
    return null;
  }

  try {
    const session = await useRedis().get(`session:${sessionId}`);
    const parsedSession: Session = JSON.parse(session);
    const user = await useRedis().get(`user:${parsedSession.netid}`);
    const parsedUser: User = JSON.parse(user);

    return {
      netid: parsedUser.netid,
      name: parsedUser.name,
      studentId: parsedUser.studentId,
      level: parsedUser.level,
      wechatOpenId: parsedUser.wechatOpenId,
      larkUnionId: parsedUser.larkUnionId,
    };
  } catch (e) {
    return null;
  }
};

export const createSession = async (event: H3Event, user: User) => {
  const { netid } = user;
  const sessionId = `${netid}:${nanoid()}`;

  const now = new Date();
  const session: Session = {
    netid,
    ip: getRealIp(event),
    userAgent: getUserAgent(event),
    createdAt: now,
    lastSeenAt: now,
  };

  await useRedis().setex(
    `session:${sessionId}`,
    useRuntimeConfig().session.expires,
    JSON.stringify(session)
  );
  await useRedis().set(`user:${netid}`, JSON.stringify(user));

  setCookie(
    event,
    useRuntimeConfig().session.cookieName,
    sessionId,
    process.env.NODE_ENV === 'production'
      ? {
          domain: '.ecnc.link',
          httpOnly: true,
          secure: true,
        }
      : undefined
  );

  return sessionId;
};

export const deleteSession = async (event: H3Event) => {
  const sessionCookieName = useRuntimeConfig().session.cookieName;
  const sessionId = getCookie(event, sessionCookieName);
  if (!sessionId) {
    return null;
  }

  const expiresDate = new Date(0);
  const cookieOptions = {
    expires: expiresDate,
  };

  setCookie(
    event,
    sessionCookieName,
    '',
    process.env.NODE_ENV === 'production'
      ? {
          domain: '.ecnc.link',
          httpOnly: true,
          secure: true,
          ...cookieOptions,
        }
      : cookieOptions
  );

  await useRedis().del(`session:${sessionId}`);
};
