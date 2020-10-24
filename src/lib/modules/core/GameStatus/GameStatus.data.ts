import { GameStatusModel } from '.';
import { logger } from '../../../logger';

const GameStatuses = [
  {
    value: 'NOT_STARTED',
  },
  {
    value: 'IN_PROGRESS',
  },
  {
    value: 'FINALIZED',
  },
];

export const createGameStatuses = async () => {
  try {
    const instances = GameStatuses.map((status) => GameStatusModel.createInstance(status));
    await Promise.all(instances);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Game Status.');
    logger.error(err);
  }
};
