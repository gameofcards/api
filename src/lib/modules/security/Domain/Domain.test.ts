import 'reflect-metadata';
import 'regenerator-runtime/runtime';

import { DomainModel } from '.';
import { StatusModel } from '../../core';
import { UITaskModel } from '../UITask';
import { createGameDataDomain } from './Domain.data';
import { createStatuses } from '../../core/Status/Status.data';
import { createUITasks } from '../UITask/UITask.data';
import db from '../../../db';

describe('Domain Tests', function () {
  beforeAll(async () => {
    await db.connect();
    await createStatuses();
    await createUITasks();
  });

  afterAll(async () => {
    await UITaskModel.deleteMany({});
    await DomainModel.deleteMany({});
    await StatusModel.deleteMany({});
    await db.disconnect();
  });

  describe('@createGameDataDomain()', function () {
    it('should initialize 1 instances', async function () {
      await createGameDataDomain();
      const instances = await DomainModel.find({});
      expect(instances.length).toBe(1);
    });
  });
});
