import { GraphQLScalarType, Kind } from 'graphql';

import { ObjectId } from 'mongodb';
import { Ref } from '@typegoose/typegoose';

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
  Development = 'DEVELOPMENT',
  Production = 'PRODUCTION',
}

export enum PoliticalRankValues {
  President = 'President',
  VicePresident = 'Vice President',
  SpeakerOfTheHouse = 'Speaker of the House',
  ProTempore = 'President Pro Tempore of the Senate',
  SecretaryOfState = 'Secretary of State',
  SecretaryOfTreasury = 'Secretary of the Treasury',
  SecretaryOfDefense = 'Secretary of Defense',
  Asshole = 'Asshole',
}

export enum PresidentsGameValidations {
  GameInProgress = 'The game is in progress.',
  GameIsFinalized = 'The game is finished.',
  GameIsFull = 'The game is full.',
  UserHasAlreadyJoined = 'You have already joined the game.',
  MinimumPlayersNotReached = 'The minimum number of players has not been reached.',
  NoRanksAssigned = 'Not all players have ranks yet.',
  PlayerRankTooLow = 'The player receiving this drink out ranks you.',
  DrinkUnfulfilled = 'The player receiving this drink currently has one from you.',
}

export enum PresidentsTurnValidations {
  NotYourTurn = 'It is not your turn.',
  InvalidCards = 'The cards selected are invalid.',
  FirstTurn3Clubs = 'The first turn of the game must contain the 3 of clubs.',
  CardsNotBetter = 'Your cards are not better than the last turn.',
}

export enum UserValidations {
  UserDoesNotExist = 'Sorry, that username does not exist.',
  IncorrectPassword = 'Sorry, your password is incorrect.',
  InvalidToken = 'Sorry, your token is invalid.'
}

export enum Errors {
  OperationFailed = 'Operation failed.',
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

export type ID = string | number | ObjectId | Ref<any, ObjectId>;
