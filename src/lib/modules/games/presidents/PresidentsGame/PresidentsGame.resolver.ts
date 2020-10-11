import { ObjectId } from 'mongodb';
import { PubSubEngine } from 'graphql-subscriptions';
import { Resolver, Query, Mutation, Subscription, Arg, PubSub, Root } from 'type-graphql';
import { PresidentsGame, PresidentsGameModel } from '.';
import { ObjectIdScalar, GameEvents, GameStatusText } from '../../../../types';
import { PresidentsGameInput, JoinPresidentsGameInput, AddPresidentsTurnInput, IdInput } from './PresidentsGame.inputs';

@Resolver((of) => PresidentsGame)
export default class PresidentsGameResolver {
  @Query((returns) => PresidentsGame)
  async presidentsGame(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return PresidentsGameModel.findById(id);
  }

  @Query((returns) => [PresidentsGame])
  async presidentsGames(): Promise<PresidentsGame[]> {
    return await PresidentsGameModel.find({});
  }

  // @Mutation((returns) => PresidentsGame)
  // async createGameAndAddUser(@Arg('input') input: PresidentsGameInput): Promise<PresidentsGame> {
  //   const { name, config, createdByUser } = input;
  //   const presidentsGame = { name, config, createdByUser };
  //   const game = await PresidentsGameModel.CreateGameAndAddUser(presidentsGame);
  //   return game;
  // }

  // @Mutation((returns) => PresidentsGame)
  // async joinGame(@Arg('input') input: JoinPresidentsGameInput, @PubSub() pubSub: PubSubEngine): Promise<PresidentsGame> {
  //   const { id, userId } = input;
  //   const game = await PresidentsGameModel.JoinGame(id, userId);
  //   await pubSub.publish(GameEvents.PlayerJoined, game);
  //   return game;
  // }

  // @Mutation((returns) => PresidentsGame)
  // async addPresidentsTurn(@Arg('input') input: AddPresidentsTurnInput, @PubSub() pubSub: PubSubEngine): Promise<PresidentsGame> {
  //   const { id, forPlayer, cardsPlayed, wasPassed } = input;
  //   const presidentsTurn = { forPlayer, cardsPlayed, wasPassed };
  //   const game = await PresidentsGameModel.AddPresidentsTurn(id, presidentsTurn);
  //   await pubSub.publish(GameEvents.TurnTaken, game);
  //   if (game.status.value === GameStatusText.Finalized) {
  //     await pubSub.publish(GameEvents.GameEnded, game);
  //   }
  //   return game;
  // }

  // @Mutation((returns) => PresidentsGame)
  // async rematch(@Arg('input') input: IdInput, @PubSub() pubSub: PubSubEngine): Promise<PresidentsGame> {
  //   const { id } = input;
  //   const game = await PresidentsGameModel.Rematch(id);
  //   await pubSub.publish(GameEvents.RematchStarted, game);
  //   return game;
  // }

  // @Mutation((returns) => PresidentsGame)
  // async fulfillDrinkRequest(@Arg('input') input: IdInput, @PubSub() pubSub: PubSubEngine): Promise<PresidentsGame> {
  //   const { id } = input;
  //   const game = await PresidentsGameModel.FulfillDrinkRequest(id);
  //   await pubSub.publish(GameEvents.DrinkRequestFulfilled, game);
  //   return game;
  // }

  // @Mutation((returns) => PresidentsGame)
  // async sendDrinkRequest(@Arg('input') input: IdInput, @PubSub() pubSub: PubSubEngine): Promise<PresidentsGame> {
  //   const { id } = input;
  //   const game = await PresidentsGameModel.SendDrinkRequest(id);
  //   await pubSub.publish(GameEvents.DrinkRequestSent, game);
  //   return game;
  // }

  // @Subscription({ topics: GameEvents.PlayerJoined })
  // playerJoined(@Root() game: PresidentsGame): PresidentsGame {
  //   return game;
  // }

  // @Subscription({ topics: GameEvents.GameStarted })
  // gameStarted(@Root() game: PresidentsGame): PresidentsGame {
  //   return game;
  // }

  // @Subscription({ topics: GameEvents.TurnTaken })
  // turnTaken(@Root() game: PresidentsGame): PresidentsGame {
  //   return game;
  // }

  // @Subscription({ topics: GameEvents.GameEnded })
  // gameEnded(@Root() game: PresidentsGame): PresidentsGame {
  //   return game;
  // }

  // @Subscription({ topics: GameEvents.RematchStarted })
  // rematchStarted(@Root() game: PresidentsGame): PresidentsGame {
  //   return game;
  // }

  // @Subscription({ topics: GameEvents.DrinkRequestSent })
  // drinkRequestSent(@Root() game: PresidentsGame): PresidentsGame {
  //   return game;
  // }

  // @Subscription({ topics: GameEvents.DrinkRequestFulfilled })
  // drinkRequestFulfilled(@Root() game: PresidentsGame): PresidentsGame {
  //   return game;
  // }
}
