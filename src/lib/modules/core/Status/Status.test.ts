import 'reflect-metadata';
import 'regenerator-runtime/runtime';

import { StatusModel } from '.';
import { StatusValues } from './../../../types';
import { createStatuses } from './Status.data';
import db from '../../../db';
import { logger } from './../../../logger';

describe('Status', function () {
  beforeAll(async () => {
    logger.info('[BEGIN] Status Tests');
    await db.connect();
  });

  afterAll(async () => {
    await StatusModel.deleteMany({});
    await db.disconnect();
    logger.info('[END] Status Tests');
  });

  describe('@createStatuses()', function () {
    it('should initialize 2 instances', async function () {
      await createStatuses();
      const instances = await StatusModel.find({});
      expect(instances.length).toBe(2);
    });
  });

  describe('@findByValue()', function () {
    it('finds instances', async function () {
      const instance = await StatusModel.findByValue(StatusValues.Active);
      expect(instance).toBeTruthy();
    });
  });
});
