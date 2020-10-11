import {
  CardRankResolver,
  CardResolver,
  DeckResolver,
  GameConfigurationResolver,
  GameStatusResolver,
  SecurityDomainResolver,
  StatusResolver,
  SuitResolver,
  UserResolver,
} from './core';

import { NonEmptyArray } from '../types';
import { PresidentsGameResolver } from './games';

const resolvers: NonEmptyArray<Function> = [
  CardResolver,
  CardRankResolver,
  DeckResolver,
  GameConfigurationResolver,
  GameStatusResolver,
  SecurityDomainResolver,
  StatusResolver,
  SuitResolver,
  UserResolver,
  PresidentsGameResolver,
];

export default resolvers;
