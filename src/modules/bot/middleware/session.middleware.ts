import { session } from 'grammy';

export const sessionMiddleware = session({
  initial: () => ({
    data: {},
  }),
});
