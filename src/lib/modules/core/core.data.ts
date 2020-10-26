import {
  CardModel,
  CardRankModel,
  DeckModel,
  GameConfigurationModel,
  GameModel,
  PlayerModel,
  RoleModel,
  StatusModel,
  SuitModel,
  UserModel,
} from '.';

import { createGameConfigurations } from './GameConfiguration/GameConfiguration.data';
import { createGameStatuses } from './GameStatus/GameStatus.data';
import { createPresidentsDeck } from './../games/presidents/PresidentsDeck/PresidentsDeck.data';
import { createStandardDeck } from './Deck/Deck.data';
import { createStatuses } from './Status/Status.data';
import { initializeCards } from './Card/Card.data';
import { initializeUsers } from './User/User.data';

export { createCardRanks } from './CardRank/CardRank.data';
export { createGameConfigurations } from './GameConfiguration/GameConfiguration.data';
export { createGameStatuses } from './GameStatus/GameStatus.data';
export { createPresidentsDeck } from './../games/presidents/PresidentsDeck/PresidentsDeck.data';
export { createRoles } from './Role/Role.data';
export { createStandardDeck } from './Deck/Deck.data';
export { createStatuses } from './Status/Status.data';
export { createSuits } from './Suit/Suit.data';
export { initializeCards } from './Card/Card.data';
export { initializeUsers } from './User/User.data';

export const initializeCoreModule = async () => {
  await initializeCards();
  await createStandardDeck();
  await createPresidentsDeck();
  await createGameConfigurations();
  await createStatuses();
  await createGameStatuses();
  await initializeUsers();
};

export const dropCoreModule = async () => {
  await CardModel.deleteMany({});
  await CardRankModel.deleteMany({});
  await DeckModel.deleteMany({});
  await GameConfigurationModel.deleteMany({});
  await GameModel.deleteMany({});
  await PlayerModel.deleteMany({});
  await RoleModel.deleteMany({});
  await StatusModel.deleteMany({});
  await SuitModel.deleteMany({});
  await UserModel.deleteMany({});
};
