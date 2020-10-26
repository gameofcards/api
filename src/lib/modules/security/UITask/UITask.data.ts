import { UITaskModel } from '.';
import { UITaskNames } from './../../../types';
import { logger } from '../../../logger';

const UITasks = [
  {
    name: UITaskNames.CreatePresidentsGame,
    description:
      'This task renders the setup page for the game in the UI, and calls the GraphQL resolver to create a Presidents Game.',
    domain: null,
  },
  {
    name: UITaskNames.PlayPresidentsGame,
    description:
      'This task renders the page for the game in the UI, and calls a few GraphQL resolvers & subscribers to play the game.',
    domain: null,
  },
  {
    name: UITaskNames.CreateUser,
    description: 'This task renders the create user page in the UI, and calls the GraphQL resolver to create a User.',
    domain: null,
  },
];

export const createUITasks = async () => {
  try {
    const instances = UITasks.map((task) => UITaskModel.createInstance(task));
    await Promise.all(instances);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create UITask.');
    logger.error(err);
  }
};
