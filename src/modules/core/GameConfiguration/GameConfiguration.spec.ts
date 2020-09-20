import { GameConfigurationModel } from './';
import { DeckModel } from '../';
import { PresidentsDeckModel } from '../../games/presidents/PresidentsDeck';
import GameConfigurations from './GameConfiguration.data';

export const createGameConfigurations = async () => {
  console.log('[UPLOAD] GameConfiguration');
  try {

    const presidentsDeck = await PresidentsDeckModel.findOne({ name: 'Standard Presidents Deck'});
    const standardDeck = await DeckModel.findOne({ name: 'Standard Deck'});

    const presidentsConfig = { ...GameConfigurations[0] };
    presidentsConfig.deck = presidentsDeck;

    const pokerConfig = { ...GameConfigurations[1] };
    pokerConfig.deck = standardDeck;

    const configs = [presidentsConfig, pokerConfig];

    let configInstance = configs.map(config => new GameConfigurationModel(config));
    let configPromises = configInstance.map(instance => instance.save());
    
    await Promise.all(configPromises);
  }
  catch (err) {
    console.log('[UPLOAD] Failed.');
    console.log(err);
  }
  console.log('[UPLOAD] Completed.');
};
