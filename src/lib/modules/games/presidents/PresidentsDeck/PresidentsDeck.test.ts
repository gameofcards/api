import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { CardModel, CardRankModel, DeckModel, SuitModel } from '../../../core';

import { PresidentsDeckModel } from '.';
import { createPresidentsDeck } from '../PresidentsDeck/PresidentsDeck.data';
import db from '../../../../db';
import { initializeCards } from './../../../core/Card/Card.data';
import { logger } from './../../../../logger';

describe('Presidents Deck', function () {
  beforeAll(async () => {
    logger.info('[BEGIN] Presidents Deck Tests');
    await db.connect();
    await initializeCards();
  });

  afterAll(async () => {
    await DeckModel.deleteMany({});
    await SuitModel.deleteMany({});
    await CardRankModel.deleteMany({});
    await CardModel.deleteMany({});
    await db.disconnect();
    logger.info('[END] Presidents Deck Tests');
  });

  describe('@createPresidentsDeck()', function () {
    it('should initialize 1 instances', async function () {
      await createPresidentsDeck();
      const instance = await PresidentsDeckModel.findOne({ name: 'Standard Presidents Deck' });
      expect(instance.cards.length).toBe(52);
      expect(instance.cards[0].cardRank.value).toBeGreaterThanOrEqual(2);
      expect(instance.cards[0].suit.value).toBeGreaterThanOrEqual(0);
    });
  });
});
