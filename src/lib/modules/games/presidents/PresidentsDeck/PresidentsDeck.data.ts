import { CardModel } from '../../../core';
import { DeckNames } from './../../../../types';
import { PresidentsDeckModel } from '.';
import { logger } from '../../../../logger';

export const createPresidentsDeck = async () => {
  try {
    let cards = await CardModel.find({});
    const deck = {
      name: DeckNames.StandardPresidentsDeck,
      cards,
    };
    let instance = await PresidentsDeckModel.createInstance(deck);
  } catch (err) {
    logger.error('[UPLOAD] Presidents Deck Failed.');
    logger.error(err.message);
  }
};
