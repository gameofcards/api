import Connection from '../db';
import { logger } from '../logger';

(async () => {
  // await Connection.connect();
  logger.info('[TEST] starting test');

  try {
    await Connection.drop();
  } catch (err) {
    logger.error('[TEST] test failed.');
  }

  logger.info('[TEST] test complete.');
  // await Connection.disconnect();
})();
