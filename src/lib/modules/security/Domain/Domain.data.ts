import { Domain, DomainModel } from '.';

import { StatusModel } from '../../core';
import { UITaskModel } from '../UITask';
import { logger } from '../../../logger';

export const createGameDataDomain = async () => {
  try {
    const active = await StatusModel.findByValue('ACTIVE');
    const tasks = await UITaskModel.findManyByNames([
      'Create Presidents Game',
      'Play Presidents Game',
      'Create User'
    ]);
  
    const GameData = {
      name: 'Game Data',
      status: active,
      tasks: tasks.map(t => t._id)
    }
    const gameDataDomain = await DomainModel.createInstance(GameData);
    // logger.info(JSON.stringify(gameDataDomain))
    let taskPromises = await tasks.map(task => task.setDomain(gameDataDomain._id))
    const taskUpdates = await Promise.all(taskPromises);
    // logger.info(JSON.stringify(taskUpdates))
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Domain.');
    logger.error(err.message);
  }
};
