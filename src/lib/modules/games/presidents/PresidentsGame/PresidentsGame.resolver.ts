import { RoleNames } from './../../../../types';
import { FulfillDrinkRequestRequest, SendDrinkRequestRequest } from './../DrinkRequest/DrinkRequest.input';
import { logger } from './../../../../logger';
import {
  CreatePresidentsGameRequest,
  JoinPresidentsGameRequest,
  PresidentsGamePayload,
  IdRequest,
  StartPresidentsGameRequest,
  RematchRequest,
} from './PresidentsGame.inputs';
import { DocumentType } from '@typegoose/typegoose';
import { ObjectId } from 'mongodb';
import { PubSubEngine } from 'graphql-subscriptions';
import { Resolver, Query, Mutation, Subscription, Arg, PubSub, Root, Authorized } from 'type-graphql';
import { PresidentsGame, PresidentsGameModel } from '.';
import { ObjectIdScalar, GameEvents, StatusValues } from '../../../../types';
import { AddPresidentsTurnRequest } from '../PresidentsTurn/PresidentsTurn.input';

@Resolver((of) => PresidentsGame)
export default class PresidentsGameResolver {
  @Authorized([RoleNames.Administrator])
  @Query((returns) => PresidentsGame)
  async presidentsGame(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return PresidentsGameModel.findById(id);
  }

  @Authorized([RoleNames.Administrator])
  @Query((returns) => [PresidentsGame])
  async presidentsGames(): Promise<PresidentsGame[]> {
    return await PresidentsGameModel.find({});
  }

  @Authorized([RoleNames.Administrator])
  @Mutation((returns) => PresidentsGame)
  async createPresidentsGame(@Arg('input') input: CreatePresidentsGameRequest): Promise<PresidentsGame> {
    const game = await PresidentsGameModel.CreateGameAndAddPlayer(input);
    return game;
  }

  @Authorized([RoleNames.Administrator])
  @Mutation((returns) => PresidentsGame)
  async joinPresidentsGame(
    @Arg('input') input: JoinPresidentsGameRequest,
    @PubSub() pubSub: PubSubEngine
  ): Promise<PresidentsGame> {
    const game = await PresidentsGameModel.JoinGame(input);
    const payload = { game: game.toObject() };
    await pubSub.publish(GameEvents.PlayerJoined, payload);
    return game;
  }

  @Authorized([RoleNames.Administrator])
  @Mutation((returns) => PresidentsGame)
  async startPresidentsGame(@Arg('input') input: StartPresidentsGameRequest, @PubSub() pubSub: PubSubEngine) {
    const game = await PresidentsGameModel.StartGame(input.id);
    const payload = { game: game.toObject() };
    await pubSub.publish(GameEvents.GameStarted, payload);
    return game;
  }

  @Authorized([RoleNames.Administrator])
  @Mutation((returns) => PresidentsGame)
  async addPresidentsTurn(@Arg('input') input: AddPresidentsTurnRequest, @PubSub() pubSub: PubSubEngine) {
    const game = await PresidentsGameModel.AddPresidentsTurn(input);
    const payload = { game: game.toObject() };
    await pubSub.publish(GameEvents.TurnTaken, payload);
    return game;
  }

  @Authorized([RoleNames.Administrator])
  @Mutation((returns) => PresidentsGame)
  async rematch(@Arg('input') input: RematchRequest, @PubSub() pubSub: PubSubEngine): Promise<PresidentsGame> {
    const game = await PresidentsGameModel.Rematch(input.id);
    const payload = { game: game.toObject() };
    await pubSub.publish(GameEvents.RematchStarted, payload);
    return game;
  }

  @Authorized([RoleNames.Administrator])
  @Mutation((returns) => PresidentsGame)
  async fulfillDrinkRequest(
    @Arg('input') input: FulfillDrinkRequestRequest,
    @PubSub() pubSub: PubSubEngine
  ): Promise<PresidentsGame> {
    const game = await PresidentsGameModel.FulfillDrinkRequest(input);
    const payload = { game: game.toObject() };
    await pubSub.publish(GameEvents.DrinkRequestFulfilled, payload);
    return game;
  }

  @Authorized([RoleNames.Administrator])
  @Mutation((returns) => PresidentsGame)
  async sendDrinkRequest(@Arg('input') input: SendDrinkRequestRequest, @PubSub() pubSub: PubSubEngine): Promise<PresidentsGame> {
    const game = await PresidentsGameModel.SendDrinkRequest(input);
    const payload = { game: game.toObject() };
    await pubSub.publish(GameEvents.DrinkRequestSent, payload);
    return game;
  }

  @Authorized([RoleNames.Administrator])
  @Subscription({ topics: GameEvents.PlayerJoined })
  playerJoined(@Root() { game }: PresidentsGamePayload): PresidentsGame {
    return game;
  }

  @Authorized([RoleNames.Administrator])
  @Subscription({ topics: GameEvents.GameStarted })
  gameStarted(@Root() { game }: PresidentsGamePayload): PresidentsGame {
    return game;
  }

  @Authorized([RoleNames.Administrator])
  @Subscription({ topics: GameEvents.TurnTaken })
  turnTaken(@Root() { game }: PresidentsGamePayload): PresidentsGame {
    return game;
  }

  @Authorized([RoleNames.Administrator])
  @Subscription({ topics: GameEvents.GameEnded })
  gameEnded(@Root() { game }: PresidentsGamePayload): PresidentsGame {
    return game;
  }

  @Authorized([RoleNames.Administrator])
  @Subscription({ topics: GameEvents.RematchStarted })
  rematchStarted(@Root() { game }: PresidentsGamePayload): PresidentsGame {
    return game;
  }

  @Authorized([RoleNames.Administrator])
  @Subscription({ topics: GameEvents.DrinkRequestSent })
  drinkRequestSent(@Root() { game }: PresidentsGamePayload): PresidentsGame {
    return game;
  }

  @Authorized([RoleNames.Administrator])
  @Subscription({ topics: GameEvents.DrinkRequestFulfilled })
  drinkRequestFulfilled(@Root() { game }: PresidentsGamePayload): PresidentsGame {
    return game;
  }
}
