import { dropCoreModule, initializeCoreModule } from './core/core.data';
import { dropGamesModule, initializeGamesModule } from './games/games.data';

import db from '../db';
import { logger } from '../logger';

export const initializeModules = async () => {
  logger.info('[DATA] initializing all modules...')
  await initializeCoreModule();
  await initializeGamesModule();
  logger.info('[DATA] initialization complete.')

};

export const dropModules = async () => {
  logger.info('[DATA] dropping all modules...')
  await dropCoreModule();
  await dropGamesModule();
  logger.info('[DATA] drop complete.')
};


(async () => {
  logger.info('[DATA] starting');
  await db.connect();

  try {
    // await db.drop()
    await dropModules();
    // await initializeModules();
  } catch (err) {
    logger.error('[DATA] failed.');
  }

  logger.info('[DATA] complete.');
  await db.disconnect();
})();
