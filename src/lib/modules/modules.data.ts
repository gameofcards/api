import Connection from '../db';
import { initializeCoreModule } from './core/core.data';
import { logger } from '../logger';

(async () => {
  logger.info('[UPLOAD] starting');
  await Connection.connect();

  try {
    await initializeCoreModule();
  } catch (err) {
    logger.error('[UPLOAD] failed.');
  }

  logger.info('[UPLOAD] complete.');
  await Connection.disconnect();
})();
