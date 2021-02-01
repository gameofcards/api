import { PoliticalRankModel } from '.';

const PoliticalRanks = [
  {
    name: 'President',
    value: 1,
  },
  {
    name: 'Vice President',
    value: 2,
  },
  {
    name: 'Speaker of the House',
    value: 3,
  },
  {
    name: 'President Pro Tempore of the Senate',
    value: 4,
  },
  {
    name: 'Secretary of State',
    value: 5,
  },
  {
    name: 'Secretary of the Treasury',
    value: 6,
  },
  {
    name: 'Secretary of Defense',
    value: 7,
  },
  {
    name: 'Asshole',
    value: 8,
  },
];

export const createPoliticalRanks = async () => {
  try {
    const instances = PoliticalRanks.map((rank) => PoliticalRankModel.createInstance(rank));
    await Promise.all(instances);
  } catch (err) {
    console.log('[UPLOAD] Political Rank Creation Failed.');
    console.log(err);
  }
};

export const dropPoliticalRanks = async () => {
  try {
    await PoliticalRankModel.deleteMany({});
  } catch (err) {
    console.log('[UPLOAD] Political Rank Dropping Failed.');
    console.log(err);
  }
};
