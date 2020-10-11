import { CardRankModel } from '.';
import { logger } from '../../../logger';

const ranks = [
  {
    name: '2',
    character: '2',
    value: 2,
  },
  {
    name: '3',
    character: '3',
    value: 3,
  },
  {
    name: '4',
    character: '4',
    value: 4,
  },
  {
    name: '5',
    character: '5',
    value: 5,
  },
  {
    name: '6',
    character: '6',
    value: 6,
  },
  {
    name: '7',
    character: '7',
    value: 7,
  },
  {
    name: '8',
    character: '8',
    value: 8,
  },
  {
    name: '9',
    character: '9',
    value: 9,
  },
  {
    name: '10',
    character: '10',
    value: 10,
  },
  {
    name: 'Jack',
    character: 'J',
    value: 11,
  },
  {
    name: 'Queen',
    character: 'Q',
    value: 12,
  },
  {
    name: 'King',
    character: 'K',
    value: 13,
  },
  {
    name: 'Ace',
    character: 'A',
    value: 14,
  },
];

export const createCardRanks = async () => {
  try {
    let instances = ranks.map((cardRank) => CardRankModel.createInstance(cardRank));
    await Promise.all(instances);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Card Rank.');
    logger.error(err.message);
  }
};
