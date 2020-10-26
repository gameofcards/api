import 'reflect-metadata';
import 'regenerator-runtime/runtime';

import { UITaskModel } from '.';
import { createUITasks } from './UITask.data';
import db from '../../../db';
import { logger } from './../../../logger';

describe('UITask Tests', function () {
  beforeAll(async () => {
    logger.info('[BEGIN] Game Configuration Tests');
    await db.connect();
  });

  afterAll(async () => {
    await UITaskModel.deleteMany({});
    await db.disconnect();
    logger.info('[END] Game Configuration Tests');
  });

  describe('@createUITasks()', function () {
    it('should initialize 3 instances', async function () {
      await createUITasks();
      const instances = await UITaskModel.find({});
      expect(instances.length).toBe(3);
    });
  });
});
