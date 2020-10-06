import Connection from '../db';
import { logger } from '../logger';

(async () => {
  await Connection.connect();
  logger.info('[TEST] starting test');

  try {


    
  } catch (err) {
    logger.info('[TEST] test failed.');
  }

  logger.error('[TEST] test complete.');
  await Connection.disconnect();
})();
