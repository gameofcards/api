import { GraphQLScalarType, Kind } from 'graphql';

import { ObjectId } from 'mongodb';

export const ObjectIdScalar = new GraphQLScalarType({
  name: 'ObjectId',
  description: 'Mongo object id scalar type',
  parseValue(value: string) {
    return new ObjectId(value); // value from the client input variables
  },
  serialize(value: ObjectId) {
    return value.toHexString(); // value sent to the client
  },
  parseLiteral(ast) {
    if (ast.kind === Kind.STRING) {
      return new ObjectId(ast.value); // value from the client query
    }
    return null;
  },
});

export enum ConfidenceLevels {
  Internal = 'INTERNAL',
  Production = 'PRODUCTION',
}

export enum StatusValues {
  InProgress = 'IN_PROGRESS',
  Finalized = 'FINALIZED',
  NotStarted = 'NOT_STARTED',
  Active = 'ACTIVE',
  Inactive = 'INACTIVE',
}

export enum GameEvents {
  PlayerJoined = 'PlayerJoined',
  GameStarted = 'GameStarted',
  TurnTaken = 'TurnTaken',
  DrinkRequestSent = 'DrinkRequestSent',
  DrinkRequestFulfilled = 'DrinkRequestFulfilled',
  GameEnded = 'GameEnded',
  RematchStarted = 'RematchStarted',
}

export enum RoleNames {
  User = 'User',
  Administrator = 'Administrator',
  Developer = 'Developer',
}

export enum UITaskNames {
  CreateUser = 'Create User',
  CreatePresidentsGame = 'Create Presidents Game',
  PlayPresidentsGame = 'Play Presidents Game',
}

export enum SecurityPolicyNames {
  GamePlayersGameTasksAllPermissions = 'Game Players - Game Tasks - All Permissions',
  AdministratorsGameTasksAllPermissions = 'Administrators - Game Tasks - All Permissions',
  DevelopersGameTasksAllPermissions = 'Developers - Game Tasks - All Permissions',
}

export enum SecurityGroupNames {
  GamePlayers = 'Game Players',
  Administrators = 'Administrators',
  Developers = 'Developers',
}

export enum PermissionNamesEnum {
  GamePlayersCreatePresidentsGame = 'Game Players - Create Presidents Game',
  GamePlayersPlayPresidentsGame = 'Game Players - Play Presidents Game',
  AdministratorsCreatePresidentsGame = 'Administrators - Create Presidents Game',
  AdministratorsPlayPresidentsGame = 'Administrators - Play Presidents Game',
}

export enum DomainNames {
  GameData = 'Game Data',
}

export enum DeckNames {
  StandardDeck = 'Standard Deck',
  StandardPresidentsDeck = 'Standard Presidents Deck',
}

export enum GameConfigurationNames {
  Presidents = 'Presidents',
  Poker = 'Poker,',
}

export type NonEmptyArray<TItem> = readonly [TItem, ...TItem[]] | [TItem, ...TItem[]];

export type InstanceId = ObjectId;
