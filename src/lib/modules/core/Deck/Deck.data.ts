import { CardModel, DeckModel } from '..';

import { DeckNames } from './../../../types';
import { logger } from '../../../logger';

export const createStandardDeck = async () => {
  try {
    let cards = await CardModel.find({});
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
