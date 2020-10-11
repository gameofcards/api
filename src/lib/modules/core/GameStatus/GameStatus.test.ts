import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { GameStatusModel } from '.';
import { createGameStatuses } from './GameStatus.data';
import db from '../../../db';

describe('Game Status Model Tests', function() {

  beforeAll(async () => {
    await db.connect();
  })

  afterAll(async () => {
    await GameStatusModel.deleteMany({});
    await db.disconnect();
  })

  describe('@createGameStatuses()', function() {

    it('should initialize 3 instances', async function() {    
      await createGameStatuses();
      const instances = await GameStatusModel.find({});
      expect(instances.length).toBe(3);
    });

  })

});
