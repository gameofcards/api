import 'reflect-metadata';
import 'regenerator-runtime/runtime';

import { UITaskModel } from '.';
import { createUITasks } from './UITask.data';
import db from '../../../db';

describe('UITask Tests', function () {
  beforeAll(async () => {
    await db.connect();
  });

  afterAll(async () => {
    await UITaskModel.deleteMany({});
    await db.disconnect();
  });

  describe('@createUITasks()', function () {
    it('should initialize 3 instances', async function () {
      await createUITasks();
      const instances = await UITaskModel.find({});
      expect(instances.length).toBe(3);
    });
  });
});
