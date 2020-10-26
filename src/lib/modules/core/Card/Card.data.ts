import { CardModel, CardRankModel, SuitModel } from '..';

import { assert } from 'console';
import { createCardRanks } from '../CardRank/CardRank.data';
import { createSuits } from '../Suit/Suit.data';
import { logger } from '../../../logger';

export const createCards = async () => {
  try {
    const suits = await SuitModel.find({});
    assert(suits.length === 4, 'Suits are not initialized.');
    const cardRanks = await CardRankModel.find({});
    assert(cardRanks.length === 13, 'CardRanks are not initialized.');

    const docs = await CardModel.find({});
    assert(docs.length === 0, 'Cards are already initialized.');

    let cards = [];
    for (let suit of suits) {
      for (let cardRank of cardRanks) {
        const shortHand = cardRank.character + suit.name;
        const card = { cardRank, suit, shortHand };
        cards.push(card);
      }
    }
    let instances = cards.map((card) => CardModel.createInstance(card));
    await Promise.all(instances);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Cards.');
    logger.error(err.message);
  }
};

export const initializeCards = async () => {
  await createSuits();
  await createCardRanks();
  await createCards();
};
