
import { initSchema } from '@/lib/db';

(async () => {
  await initSchema();
  // eslint-disable-next-line no-console
  console.log('Schema initialized');
})();
