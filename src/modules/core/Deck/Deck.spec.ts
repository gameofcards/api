import { CardModel, DeckModel } from '../';

export const createStandardDeck = async () => {
  console.log('[UPLOAD] Uploading Deck data...');
  try {  
    let cardInstances = await CardModel.find({});
    const deck = {
      name: 'Standard Deck',
      cards: cardInstances
    }
    let deckInstance = new DeckModel(deck);
    await deckInstance.save();
  }
  catch (err) {
    console.log('[UPLOAD] Failed to create Deck.');
    console.log(err);
  }
  console.log('[UPLOAD] Deck upload completed.');
};