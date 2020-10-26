import { CardModel, DeckModel } from '..';

import { DeckNames } from './../../../types';
import { assert } from 'console';
import { logger } from '../../../logger';

export const createStandardDeck = async () => {
  try {
    let cards = await CardModel.find({});
    assert(cards.length === 52, 'Cards are not initialized.');
    const deck = {
      name: DeckNames.StandardDeck,
      cards,
    };
    let instance = await DeckModel.createInstance(deck);
  } catch (err) {
    logger.error('[UPLOAD] Standard Deck Failed.');
    logger.error(err.message);
  }
};
