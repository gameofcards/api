import { DomainNames, StatusValues, UITaskNames } from './../../../types';

import { DomainModel } from '.';
import { StatusModel } from '../../core';
import { UITaskModel } from '../UITask';
import { assert } from 'console';
import { logger } from '../../../logger';

export const createGameDataDomain = async () => {
  try {
    const active = await StatusModel.findByValue(StatusValues.Active);
    const tasks = await UITaskModel.findManyByNames([
      UITaskNames.CreatePresidentsGame, 
      UITaskNames.PlayPresidentsGame, 
      UITaskNames.CreateUser 
    ]);
    assert(active, 'Statuses not initialized.');
    assert(tasks.length === 3, 'Tasks not initialized.');
    const GameData = {
      name: DomainNames.GameData,
      status: active,
      tasks: tasks.map((t) => t._id),
    };
    const gameDataDomain = await DomainModel.createInstance(GameData);
    let taskPromises = await tasks.map((task) => task.setDomain(gameDataDomain._id));
    await Promise.all(taskPromises);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Domain.');
    logger.error(err.message);
  }
};
