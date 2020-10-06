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

export interface PresidentsTurnInput {
  forPlayer: ObjectId;
  cardsPlayed: ObjectId[];
  wasPassed: boolean;
}

export enum GameStatusText {
  InProgress = 'IN_PROGRESS',
  Finalized = 'FINALIZED',
  NotStarted = 'NOT_STARTED',
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

export interface PresidentsGameInput {
  name: string;
  config: ObjectId;
  createdByUser: ObjectId;
}

export interface CreateUserInput {
  username: string;
  email: string;
  displayName: string;
  password: string;
}

export interface CreateCardInput {
  shortHand: string;
  cardRank: ObjectId;
  suit: ObjectId;
}

export interface CreateCardRankInput {
  name: string;
  character: string;
  value: number;
}

export interface CreateDeckInput {
  name: string;
  cards: InstanceId[];
}

export interface CreateGameConfigurationInput {
  name: string;
  maxPlayers: number;
  minPlayers: number;
  deck: InstanceId[];
  numDecks: number
}

export interface CreateGameStatusInput {
  value: string;
}

export interface CreateSuitInput {
  name: string;
  character: string;
  value: number;
}

export interface CreateSecurityDomainInput {
  name: string;
  clearanceLevel: number;
}

export interface CreatePoliticalRankInput {
  name: string;
  value: number;
}

export type NonEmptyArray<TItem> = readonly [TItem, ...TItem[]] | [TItem, ...TItem[]];

export type InstanceId = ObjectId;
