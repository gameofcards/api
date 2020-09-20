import {
  CardResolver,
  CardRankResolver,
  DeckResolver,
  GameConfigurationResolver,
  GameStatusResolver,
  PlayerResolver,
  SecurityDomainResolver,
  StatusResolver,
  SuitResolver,
  UserResolver,
} from './core';

import { PresidentsGameResolver } from './games';

import { NonEmptyArray } from '../types';

const resolvers: NonEmptyArray<Function> = [
  CardResolver,
  CardRankResolver,
  DeckResolver,
  GameConfigurationResolver,
  GameStatusResolver,
  PlayerResolver,
  SecurityDomainResolver,
  StatusResolver,
  SuitResolver,
  UserResolver,
  PresidentsGameResolver,
];

export default resolvers;
