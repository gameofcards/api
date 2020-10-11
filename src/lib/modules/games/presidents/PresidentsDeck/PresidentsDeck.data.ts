import { CardModel } from '../../../core';
import { PresidentsDeckModel } from '.';
import { logger } from '../../../../logger';

export const createPresidentsDeck = async () => {
  try {
    let cards = await CardModel.find({});
    const deck = {
      name: 'Standard Presidents Deck',
      cards,
    };
    let instance = await PresidentsDeckModel.createInstance(deck);
  } catch (err) {
    logger.error('[UPLOAD] Presidents Deck Failed.');
    logger.error(err.message);
  }
};
