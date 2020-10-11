import { SuitModel } from '.';
import { logger } from '../../../logger';

const suits = [
  {
    name: 'Clubs',
    color: 'Black',
    character: '\u2663',
    value: 0,
  },
  {
    name: 'Diamonds',
    color: 'Red',
    character: '\u2666',
    value: 1,
  },
  {
    name: 'Hearts',
    color: 'Red',
    character: '\u2665',
    value: 2,
  },
  {
    name: 'Spades',
    color: 'Black',
    character: '\u2660',
    value: 3,
  },
];

export const createSuits = async () => {
  try {
    let instances = suits.map((suit) => SuitModel.createInstance(suit));
    await Promise.all(instances);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Suits.');
    logger.error(err.message);
  }
};
