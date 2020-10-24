import { Application } from './lib/app';
import db from './lib/db';
import { logger } from './lib/logger';

(async () => {
  try {
    logger.info('[Application] starting up!');
    await db.connect();
    const app = Application.GetInstance();
    await app.start();
  } catch (err) {
    logger.error('[Application] startup failed');
    logger.error(err.message);
    await db.disconnect();
  }
})();
