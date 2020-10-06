import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { CardModel } from '.';
import { CardRankModel } from '../CardRank';
import { SuitModel } from '../Suit';
import { createCardRanks } from '../CardRank/CardRank.data';
import { createCards } from './Card.data';
import { createSuits } from '../Suit/Suit.data';
import db from '../../../db';

export const CardTests = () => {

  describe('Card Model Tests', function() {

    beforeAll(async () => {
      await db.connect();
      await createSuits();
      await createCardRanks();
    })

    afterAll(async () => {
      await CardModel.deleteMany({});
      await CardRankModel.deleteMany({});
      await SuitModel.deleteMany({});
      await db.disconnect();
    })

    describe('@createCards()', function() {

      it('should initialize 52 instances', async function() {    
        await createCards();
        const instances = await CardModel.find({});
        expect(instances.length).toBe(52);
      });

    })

    describe('validations', function() {    

      it('shortHand is required', async function() {
        const cardRank = await CardRankModel.findOne({});
        const suit = await SuitModel.findOne({});
        const card = { cardRank, suit };
        try {
          const instance = await CardModel.createInstance(card);
        } catch (err) {
          expect(err.message).toEqual('Card validation failed: shortHand: Path `shortHand` is required.')
        }

      });

      it('shortHand must be unique', async function() {
        const { shortHand, cardRank, suit } = await CardModel.findOne({shortHand: '3Clubs'});
        const card = { shortHand, cardRank, suit };
        try {
          const instance = await CardModel.createInstance(card);
        } catch (err) {
          expect(err.message).toContain('duplicate key error');
        }
      });

      it('cardRank is required', async function() {    
        const shortHand = 'shortHand';
        const suit = await SuitModel.findOne({});
        const card = { shortHand, suit };
        try {
          const instance = await CardModel.createInstance(card);
        } catch (err) {
          expect(err.message).toEqual('Card validation failed: cardRank: Path `cardRank` is required.')
        }
      });

      it('suit is required', async function() {    
        const shortHand = 'shortHand';
        const cardRank = await CardRankModel.findOne({});
        const card = { shortHand, cardRank };
        try {
          const instance = await CardModel.createInstance(card);
        } catch (err) {
          expect(err.message).toEqual('Card validation failed: suit: Path `suit` is required.')
        }
      });
      
    });

  })};
