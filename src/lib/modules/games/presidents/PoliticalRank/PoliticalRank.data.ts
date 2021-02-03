import { PoliticalRankModel } from '.';
import { PoliticalRankValues } from './../../../../types';

const PoliticalRanks = [
  {
    name: PoliticalRankValues.President,
    value: 1,
  },
  {
    name: PoliticalRankValues.VicePresident,
    value: 2,
  },
  {
    name: PoliticalRankValues.SpeakerOfTheHouse,
    value: 3,
  },
  {
    name: PoliticalRankValues.ProTempore,
    value: 4,
  },
  {
    name: PoliticalRankValues.SecretaryOfState,
    value: 5,
  },
  {
    name: PoliticalRankValues.SecretaryOfTreasury,
    value: 6,
  },
  {
    name: PoliticalRankValues.SecretaryOfDefense,
    value: 7,
  },
  {
    name: PoliticalRankValues.Asshole,
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
