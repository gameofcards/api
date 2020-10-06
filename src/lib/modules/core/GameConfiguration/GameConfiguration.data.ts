import { DeckModel } from '..';
import { GameConfigurationModel } from '.';
import { PresidentsDeckModel } from '../../games/presidents/PresidentsDeck';
import { logger } from '../../../logger';

const GameConfigurations = [
  {
    name: 'Presidents',
    maxPlayers: 8,
    minPlayers: 2,
    numDecks: 1,
    deck: null,
  },
  {
    name: 'Poker',
    maxPlayers: 5,
    minPlayers: 2,
    numDecks: 2,
    deck: null,
  },
];


export const createGameConfigurations = async () => {
  try {
    const presidentsDeck = await PresidentsDeckModel.findOne({ name: 'Standard Presidents Deck' });
    const standardDeck = await DeckModel.findOne({ name: 'Standard Deck' });
    const presidentsConfig = { ...GameConfigurations[0] };
    presidentsConfig.deck = presidentsDeck;
    const pokerConfig = { ...GameConfigurations[1] };
    pokerConfig.deck = standardDeck;
    const configs = [presidentsConfig, pokerConfig];
    let instances = configs.map((config) => GameConfigurationModel.createInstance(config));
    await Promise.all(instances);
  } catch (err) {
    logger.error('[UPLOAD] Failed.');
    logger.error(err);
  }
};
