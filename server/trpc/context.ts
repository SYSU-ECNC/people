import type { inferAsyncReturnType } from '@trpc/server';
import type { H3Event } from 'h3';

import { useSession } from '~~/server/lib/session';

// The app's context - is generated for each incoming request
export async function createContext(event: H3Event) {
  return {
    session: await useSession(event),
    event,
  };
}

export type Context = inferAsyncReturnType<typeof createContext>;
