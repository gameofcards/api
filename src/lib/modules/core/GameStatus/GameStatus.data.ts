import { GameStatusModel } from '.';
import { StatusValues } from './../../../types';
import { logger } from '../../../logger';

const GameStatuses = [
  {
    value: StatusValues.NotStarted,
  },
  {
    value: StatusValues.InProgress,
  },
  {
    value: StatusValues.Finalized,
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
