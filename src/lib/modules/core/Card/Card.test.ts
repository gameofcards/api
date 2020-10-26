import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { CardModel } from '.';
import { CardRankModel } from '../CardRank';
import { SuitModel } from '../Suit';
import db from '../../../db';
import { initializeCards } from './Card.data';
import { logger } from './../../../logger';

describe('Card', function () {
  beforeAll(async () => {
    logger.info('[BEGIN] Card Tests');
    await db.connect();
    await initializeCards();
  });

  afterAll(async () => {
    await CardModel.deleteMany({});
    await CardRankModel.deleteMany({});
    await SuitModel.deleteMany({});
    await db.disconnect();
    logger.info('[END] Card Tests');
  });

  describe('@createCards()', function () {
    it('should initialize 52 instances', async function () {
      const instance = await CardModel.findOne({ shortHand: '3Clubs' });
      expect(instance).toBeDefined();
      expect(instance.shortHand).toEqual('3Clubs');
      expect(instance.cardRank.value).toEqual(3);
      expect(instance.suit.name).toEqual('Clubs');
    });
  });

  describe('validations', function () {
    it('shortHand is required', async function () {
      const cardRank = await CardRankModel.findOne({});
      const suit = await SuitModel.findOne({});
      const card = { cardRank, suit };
      try {
        const instance = await CardModel.createInstance(card as any);
      } catch (err) {
        expect(err.message).toEqual('Card validation failed: shortHand: Path `shortHand` is required.');
      }
    });

    it('shortHand must be unique', async function () {
      const { shortHand, cardRank, suit } = await CardModel.findOne({ shortHand: '3Clubs' });
      const card = { shortHand, cardRank, suit };
      try {
        const instance = await CardModel.createInstance(card as any);
      } catch (err) {
        expect(err.message).toContain('duplicate key error');
      }
    });

    it('cardRank is required', async function () {
      const shortHand = 'shortHand';
      const suit = await SuitModel.findOne({});
      const card = { shortHand, suit };
      try {
        const instance = await CardModel.createInstance(card as any);
      } catch (err) {
        expect(err.message).toEqual('Card validation failed: cardRank: Path `cardRank` is required.');
      }
    });

    it('suit is required', async function () {
      const shortHand = 'shortHand';
      const cardRank = await CardRankModel.findOne({});
      const card = { shortHand, cardRank };
      try {
        const instance = await CardModel.createInstance(card as any);
      } catch (err) {
        expect(err.message).toEqual('Card validation failed: suit: Path `suit` is required.');
      }
    });
  });
});
