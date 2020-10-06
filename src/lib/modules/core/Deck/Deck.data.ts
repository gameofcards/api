import { CardModel, DeckModel } from '..';

import { logger } from '../../../logger';

export const createStandardDeck = async () => {
  try {
    let cards = await CardModel.find({});
    const deck = {
      name: 'Standard Deck',
      cards
    };
    let instance = await DeckModel.createInstance(deck);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Deck.');
    logger.error(err);
  }
};
