import { StatusModel } from '.';
import { StatusValues } from './../../../types';
import { logger } from '../../../logger';

const Statuses = [
  {
    value: StatusValues.Active,
  },
  {
    value: StatusValues.Inactive,
  }
];

export const createStatuses = async () => {
  try {
    const instances = Statuses.map((status) => StatusModel.createInstance(status));
    await Promise.all(instances);
  } catch (err) {
    logger.error('[UPLOAD] Failed to Status.');
    logger.error(err);
  }
};
