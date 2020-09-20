import Suits from './Suit.data';
import { SuitModel } from './';

export const createSuits = async () => {
  console.log('[UPLOAD] Uploading Suit data...');
  try {
    let suitInstances = Suits.map(suit => new SuitModel(suit));
    let suitPromises = suitInstances.map(instance => instance.save());
    await Promise.all(suitPromises);
  }
  catch (err) {
    console.log('[UPLOAD] Failed to create Suits.');
    console.log(err);
  }
  console.log('[UPLOAD] Suit upload completed.');
};