import { createPoliticalRanks, dropPoliticalRanks } from './PoliticalRank/PoliticalRank.data';

export const initializePresidentsModule = async () => {
  await createPoliticalRanks();
};

export const dropPresidentsModule = async () => {
  await dropPoliticalRanks();
};
