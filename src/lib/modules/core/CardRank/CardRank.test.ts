import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { CardRankModel } from '.';
import { createCardRanks } from './CardRank.data';
import db from '../../../db';

export const CardRankTests = () => {

  describe('Card Rank Model Tests', function() {


    beforeAll(async () => {
      await db.connect();
    })

    afterAll(async () => {
      await CardRankModel.deleteMany({});
      await db.disconnect();
    })

    describe('@createCardRanks()', function() {

      it('should initialize 13 instances', async function() {    
        await createCardRanks();
        const instances = await CardRankModel.find({});
        expect(instances.length).toBe(13);
      });

    })

    describe('validations', function() {

      it('name is required', async function() {
        const cardRank = {
          character: '3',
          value: 3
        };
        try {
          const instance = await CardRankModel.createInstance(cardRank);
        } catch (err) {
          expect(err.message).toEqual('CardRank validation failed: name: Path `name` is required.')
        }
      });
  
      it('name must be unique', async function() {
        const cardRank = {
          name: '2',
          character: 'random',
          value: 22
        }
        try {
          const instance = await CardRankModel.createInstance(cardRank);
        } catch (err) {
          expect(err.message).toContain('duplicate key error');
        }
      });
  
      it('character is required', async function() {
        const cardRank = {
          name: 'Jack',
          value: 11
        };
        try {
          const instance = await CardRankModel.createInstance(cardRank);
        } catch (err) {
          expect(err.message).toEqual('CardRank validation failed: character: Path `character` is required.')
        }
      });
  
      it('character must be unique', async function() {
        const cardRank = {
          name: '22',
          character: '2',
          value: 22
        }
        try {
          const instance = await CardRankModel.createInstance(cardRank);
        } catch (err) {
          expect(err.message).toContain('duplicate key error');
        }
      });
  
      it('value is required', async function() {
        const cardRank = {
          name: 'Jack',
          character: 'J'
        };
        try {
          const instance = await CardRankModel.createInstance(cardRank);
        } catch (err) {
          expect(err.message).toEqual('CardRank validation failed: value: Path `value` is required.')
        }
      });
      
      it('value must be unique', async function() {
        const cardRank = {
          name: '22',
          character: '22',
          value: 2
        }
        try {
          const instance = await CardRankModel.createInstance(cardRank);
        } catch (err) {
          expect(err.message).toContain('duplicate key error');
        }
      });

    })
  })}