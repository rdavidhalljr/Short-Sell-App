
import { ensureSchema } from '@/lib/db';

export async function withBootstrap<T>(fn: () => Promise<T>): Promise<T> {
  await ensureSchema();
  return await fn();
}
