import { DeckNames, GameConfigurationNames } from './../../../types';

import { DeckModel } from '..';
import { GameConfigurationModel } from '.';
import { PresidentsDeckModel } from '../../games/presidents/PresidentsDeck';
import { assert } from 'console';
import { logger } from '../../../logger';

const GameConfigurations = [
  {
    name: GameConfigurationNames.Presidents,
    maxPlayers: 8,
    minPlayers: 2,
    numDecks: 1,
    deck: null,
  },
  {
    name: GameConfigurationNames.Poker,
    maxPlayers: 5,
    minPlayers: 2,
    numDecks: 2,
    deck: null,
  },
];

export const createGameConfigurations = async () => {
  try {
    const presidentsDeck = await PresidentsDeckModel.findOne({ name: DeckNames.StandardPresidentsDeck });
    const standardDeck = await DeckModel.findOne({ name: DeckNames.StandardDeck });
    assert(presidentsDeck && standardDeck, 'PresidentsDeck is not initialized.');
    assert(standardDeck, 'Deck are not initialized.');
    const presidentsConfig = { ...GameConfigurations[0] };
    presidentsConfig.deck = presidentsDeck;
    const pokerConfig = { ...GameConfigurations[1] };
    pokerConfig.deck = standardDeck;
    const configs = [presidentsConfig, pokerConfig];
    let instancePromises = configs.map((config) => GameConfigurationModel.createInstance(config));
    let instances = await Promise.all(instancePromises);
  } catch (err) {
    logger.error('[UPLOAD] Failed to create Game Configuration.');
    logger.error(err);
  }
};
