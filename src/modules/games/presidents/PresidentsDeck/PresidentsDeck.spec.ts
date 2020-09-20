import { CardModel } from '../../../core';
import { PresidentsDeckModel } from './';

export const createPresidentsDeck = async () => {
  console.log('[UPLOAD] PresidentsDeck');
  try {
    let cardInstances = await CardModel.find({});
    const deck = {
      name: 'Standard Presidents Deck',
      cards: cardInstances,
    };
    let deckInstance = new PresidentsDeckModel(deck);
    await deckInstance.save();
  } catch (err) {
    console.log('[UPLOAD] Failed.');
    console.log(err);
  }
  console.log('[UPLOAD] Completed.');
};
