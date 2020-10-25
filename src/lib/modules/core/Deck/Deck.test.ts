import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { CardModel } from '../Card';
import { CardRankModel } from '../CardRank';
import { DeckModel } from '.';
import { SuitModel } from '../Suit';
import { createCardRanks } from '../CardRank/CardRank.data';
import { createCards } from '../Card/Card.data';
import { createStandardDeck } from './Deck.data';
import { createSuits } from '../Suit/Suit.data';
import db from '../../../db';
import { logger } from '../../../logger';

describe.skip('Deck', function () {
  beforeAll(async () => {
    await db.connect();
    await createSuits();
    await createCardRanks();
    await createCards();
  });

  afterAll(async () => {
    await DeckModel.deleteMany({});
    await SuitModel.deleteMany({});
    await CardRankModel.deleteMany({});
    await CardModel.deleteMany({});
    await db.disconnect();
  });

  describe('@createStandardDeck()', function () {
    it('should initialize 1 instance', async function () {
      await createStandardDeck();
      const instance = await DeckModel.findOne({ name: 'Standard Deck' });
      expect(instance.cards.length).toBe(52);
      expect(instance.cards[0].cardRank.value).toBeGreaterThanOrEqual(2);
      expect(instance.cards[0].suit.value).toBeGreaterThanOrEqual(0);
    });
  });

  it('@getShuffledCards()', async () => {
    const deck = await DeckModel.findOne({ name: 'Standard Deck' });
    const shuffled = deck.getShuffledCards();
    expect(shuffled.length).toEqual(deck.cards.length);
    expect(shuffled[0].shortHand !== deck.cards[0].shortHand).toBeTruthy();
  });

  it('@deal()', async () => {
    const deck = await DeckModel.findOne({ name: 'Standard Deck' });
    const shuffled = deck.getShuffledCards();
    const dealtCards = deck.deal(2, shuffled);
    expect(dealtCards.length).toEqual(2);
    expect(dealtCards[0].length).toEqual(26);
    expect(dealtCards[1].length).toEqual(26);
  });
});
