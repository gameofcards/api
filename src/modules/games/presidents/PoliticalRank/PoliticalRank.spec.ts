import { PoliticalRankModel } from './';
import PoliticalRanks from './PoliticalRank.data';

export const createPoliticalRanks = async () => {
  console.log('[UPLOAD] Political Rank');
  try {
    const rankInstances = PoliticalRanks.map((rank) => new PoliticalRankModel(rank));
    let rankPromises = rankInstances.map((instance) => instance.save());
    await Promise.all(rankPromises);
  } catch (err) {
    console.log('[UPLOAD] Failed.');
    console.log(err);
  }
  console.log('[UPLOAD] Completed.');
};
