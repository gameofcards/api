import 'reflect-metadata';
import 'regenerator-runtime/runtime';

import { ToggleModel } from '.';
import { createToggles } from './Toggle.data';
import db from '../../../db';
import { logger } from '../../../logger';

describe('Toggle Tests', function () {
  beforeAll(async () => {
    logger.info('[BEGIN] Domain Tests');
    await db.connect();
  });

  afterAll(async () => {
    await ToggleModel.deleteMany({});
    await db.disconnect();
    logger.info('[END] Domain Tests');
  });

  describe('@createToggles()', function () {
    it('should initialize 1 instances', async function () {
      await createToggles();
      const instances = await ToggleModel.find({});
      expect(instances.length).toBe(1);
    });
  });
});
