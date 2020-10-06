import { CardModel, CardRankModel, SuitModel } from '..';

import { logger } from '../../../logger';

export const createCards = async () => {
  try {
    const suits = await SuitModel.find({});
    if (suits.length !== 4) return Promise.reject(new Error('Suits not initialized. Cannot create cards.'));
    const cardRanks = await CardRankModel.find({});
    if (cardRanks.length !== 13) return Promise.reject(new Error('CardRanks not initialized. Cannot create cards.'));
    let cards = [];
    for (let suit of suits) {
      for (let cardRank of cardRanks) {
        const shortHand = cardRank.character + suit.name;
        cards.push({ cardRank, suit, shortHand });
      }
    }
    let instances = cards.map((card) => CardModel.createInstance(card));
    await Promise.all(instances);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Cards.');
    logger.error(err);
  }
};
