import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { GameStatusModel } from '.';
import { createGameStatuses } from './GameStatus.data';
import db from '../../../db';

export const GameStatusTests = () => {

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


    describe('#createInstance()', function() {
      it('should create an instance', async function() {    
        expect(1).toEqual(1)
      })
    })

  })};
