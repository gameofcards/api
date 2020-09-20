import CardRanks from './CardRank.data';
import { CardRankModel } from './';

export const createCardRanks = async () => {
  console.log('[UPLOAD] Uploading CardRank data...');
  try {
    let cardRankInstances = CardRanks.map((cardRank) => new CardRankModel(cardRank));
    let cardRankPromises = cardRankInstances.map((instance) => instance.save());
    await Promise.all(cardRankPromises);
  } catch (err) {
    console.log('[UPLOAD] Failed to create CardRanks.');
    console.log(err);
  }
  console.log('[UPLOAD] CardRank upload completed.');
};
