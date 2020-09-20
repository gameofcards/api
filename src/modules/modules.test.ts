import {
  CardModel,
  CardRankModel,
  DeckModel,
  GameModel,
  GameConfigurationModel,
  PlayerModel,
  SecurityDomainModel,
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

import { createCards } from './core/Card/Card.spec';
import { createCardRanks } from './core/CardRank/CardRank.spec';
import { createStandardDeck } from './core/Deck/Deck.spec';
import { createGameConfigurations } from './core/GameConfiguration/GameConfiguration.spec';
import { createGameStatuses } from './core/GameStatus/GameStatus.spec';
import { createSecurityDomains } from './core/SecurityDomain/SecurityDomain.spec';
import { createSuits } from './core/Suit/Suit.spec';
import { createUsers } from './core/User/User.spec';

import { createPresidentsDeck } from './games/presidents/PresidentsDeck/PresidentsDeck.spec';
import { createPoliticalRanks } from './games/presidents/PoliticalRank/PoliticalRank.spec';

import Connection from '../db';

const dropAll = async () => {
  console.log('[UPLOAD] Dropping the database...');
  try {
    const core = await Promise.all([
      CardModel.deleteMany({}),
      CardRankModel.deleteMany({}),
      DeckModel.deleteMany({}),
      GameModel.deleteMany({}),
      GameConfigurationModel.deleteMany({}),
      PlayerModel.deleteMany({}),
      SecurityDomainModel.deleteMany({}),
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
    console.log('[UPLOAD] Failed to drop the database.');
    console.log(err);
  }
  console.log('[UPLOAD] Database drop completed.');
};

const initAll = async () => {
  console.log('[UPLOAD] Initializing...');
  try {
    await createSuits();
    await createCardRanks();
    await createCards();
    await createSecurityDomains();
    await createStandardDeck();
    await createGameConfigurations();
    await createGameStatuses();
    await createPresidentsDeck();
    await createPoliticalRanks();
    await createUsers();
  } catch (err) {
    console.log('[UPLOAD] Failed to initialize the database.');
    console.log(err);
  }
  console.log('[UPLOAD] Database initialization completed.');
};

(async () => {
  await Connection.connect();

  try {
    await initAll();
  } catch (err) {
    console.log('[UPLOAD] Data upload failed.');
  }

  console.log('[UPLOAD] Data upload complete.');
  await Connection.disconnect();
})();
