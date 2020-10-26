import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { GameStatusModel } from '.';
import { createGameStatuses } from './GameStatus.data';
import db from '../../../db';
import { logger } from './../../../logger';

describe('Game Status', function () {
  beforeAll(async () => {
    logger.info('[BEGIN] Game Status Tests');
    await db.connect();
  });

  afterAll(async () => {
    await GameStatusModel.deleteMany({});
    await db.disconnect();
    logger.info('[END] Game Status Tests');
  });

  describe('@createGameStatuses()', function () {
    it('should initialize 3 instances', async function () {
      await createGameStatuses();
      const instances = await GameStatusModel.find({});
      expect(instances.length).toBe(3);
    });
  });
});
