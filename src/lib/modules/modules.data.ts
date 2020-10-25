import {
  CardModel,
  CardRankModel,
  DeckModel,
  GameConfigurationModel,
  GameModel,
  PlayerModel,
  StatusModel,
  SuitModel,
  UserModel,
} from './core';
import {
  DrinkRequestModel,
  PoliticalRankModel,
  PresidentsDeckModel,
  PresidentsGameModel,
  PresidentsPlayerModel,
  PresidentsRoundModel,
  PresidentsTurnModel,
} from './games/presidents';

import Connection from '../db';
import { createCardRanks } from './core/CardRank/CardRank.data';
import { createCards } from './core/Card/Card.data';
import { createGameConfigurations } from './core/GameConfiguration/GameConfiguration.data';
import { createGameStatuses } from './core/GameStatus/GameStatus.data';
import { createPoliticalRanks } from './games/presidents/PoliticalRank/PoliticalRank.data';
import { createPresidentsDeck } from './games/presidents/PresidentsDeck/PresidentsDeck.data';
import { createStandardDeck } from './core/Deck/Deck.data';
import { createSuits } from './core/Suit/Suit.data';
import { createUsers } from './core/User/User.data';
import { logger } from '../logger';

const dropAll = async () => {
  logger.info('[UPLOAD] Dropping the database...');
  try {
    const core = await Promise.all([
      CardModel.deleteMany({}),
      CardRankModel.deleteMany({}),
      DeckModel.deleteMany({}),
      GameModel.deleteMany({}),
      GameConfigurationModel.deleteMany({}),
      PlayerModel.deleteMany({}),
      StatusModel.deleteMany({}),
      SuitModel.deleteMany({}),
      UserModel.deleteMany({}),
    ]);

    const presidents = await Promise.all([
      DrinkRequestModel.deleteMany({}),
      PoliticalRankModel.deleteMany({}),
      PresidentsDeckModel.deleteMany({}),
      PresidentsGameModel.deleteMany({}),
      PresidentsPlayerModel.deleteMany({}),
      PresidentsRoundModel.deleteMany({}),
      PresidentsTurnModel.deleteMany({}),
    ]);
  } catch (err) {
    logger.error('[UPLOAD] Failed to drop the database.');
    logger.error(err);
  }
  logger.info('[UPLOAD] Database drop completed.');
};

const initAll = async () => {
  logger.info('[UPLOAD] Initializing the Database...');
  try {
    await createSuits();
    await createCardRanks();
    await createCards();
    await createStandardDeck();
    await createPresidentsDeck();
    await createGameConfigurations();
    await createGameStatuses();
    await createPoliticalRanks();
    await createUsers();
  } catch (err) {
    logger.error('[UPLOAD] Failed to initialize the database.');
    logger.error(err);
  }
  logger.info('[UPLOAD] Database initialization complete.');
};

(async () => {
  logger.info('[UPLOAD] starting');
  await Connection.connect();

  try {
    await dropAll();
    // await initAll();
  } catch (err) {
    logger.error('[UPLOAD] failed.');
  }

  logger.info('[UPLOAD] complete.');
  await Connection.disconnect();
})();
