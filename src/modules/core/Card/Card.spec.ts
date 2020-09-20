import { CardModel, SuitModel, CardRankModel } from '../';

export const createCards = async () => {
  console.log('[UPLOAD] Uploading Card data...');
  try {  
    const suits = await SuitModel.find({});
    if (suits.length !== 4)
      return Promise.reject(new Error('Suits not initialized. Cannot create cards.'));
    const cardRanks = await CardRankModel.find({});
    if (cardRanks.length !== 13)
      return Promise.reject(new Error('CardRanks not initialized. Cannot create cards.'));
    let cards = [];
    for (let suit of suits) {
      for (let cardRank of cardRanks) {
        const shortHand = cardRank.character + suit.name;
        cards.push({ cardRank, suit, shortHand });
      }
    }
    let instances = cards.map(card => new CardModel(card));
    let promises = instances.map(instance => instance.save());
    await Promise.all(promises);
  }
  catch (err) {
    console.log('[UPLOAD] Failed to create Cards.');
    console.log(err);
  }
  console.log('[UPLOAD] Card upload completed.');
};