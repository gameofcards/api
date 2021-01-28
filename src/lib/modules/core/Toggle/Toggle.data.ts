import { ConfidenceLevels } from '../../../types';
import { ToggleModel } from '.';
import { logger } from './../../../logger';

const toggles = [
  {
    name: 'v1Alpha',
    description: 'API v1 alpha for Game of Cards',
    confidenceLevel: ConfidenceLevels.Internal,
  },
];

export const createToggles = async () => {
  try {
    let togglePromises = await toggles.map((toggle) => ToggleModel.createInstance(toggle));
    await Promise.all(togglePromises);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Toggle.');
    logger.error(err.message);
  }
};
