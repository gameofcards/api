import {
  AddPresidentsTurnInput,
  AddPresidentsTurnRequest,
  GameDataForTurnValidation,
} from './../PresidentsTurn/PresidentsTurn.input';
import {
  Card,
  CardModel,
  Game,
  GameConfiguration,
  GameConfigurationModel,
  GameStatus,
  GameStatusModel,
  Instance,
  Player,
  User,
  UserModel,
} from '../../../core';
import {
  CreatePresidentsGameInstance,
  CreatePresidentsGameRequest,
  IdRequest,
  JoinPresidentsGameRequest,
  RoundEndTurnData,
  StartPresidentsGameRequest,
} from './PresidentsGame.inputs';
import {
  DocumentType,
  modelOptions as ModelOptions,
  plugin as Plugin,
  prop as Property,
  Ref,
  ReturnModelType,
  getName,
} from '@typegoose/typegoose';
import { DrinkRequest, DrinkRequestModel } from '../DrinkRequest';
import { Field, ID, ObjectType } from 'type-graphql';
import { FulfillDrinkRequestRequest, SendDrinkRequestRequest } from './../DrinkRequest/DrinkRequest.input';
import { PoliticalRank, PoliticalRankModel } from '../PoliticalRank';
import { PresidentsPlayer, PresidentsPlayerModel } from '../PresidentsPlayer';
import { PresidentsRound, PresidentsRoundModel } from '../PresidentsRound';
import { PresidentsTurn, PresidentsTurnModel } from '../PresidentsTurn';

import { ObjectId } from 'mongodb';
import { PresidentsDeckModel } from '../PresidentsDeck';
import { PresidentsGameError } from './errors';
import { StatusValues } from '../../../../types';
import { Utils } from '../../../modules.utils';
import { logger } from './../../../../logger';

/**
 * This class represents a PresidentsGame.
 * @extends Game
 * @public
 *
 */
@ModelOptions(Utils.getDisciminatorModelOptions())
@ObjectType({ implements: [Instance, Game] })
export default class PresidentsGame extends Game {
  public _id!: ObjectId;
  public id!: string;
  public name!: string;
  public createdAt!: Date;
  public startedAt?: Date;
  public finishedAt?: Date;
  public status!: GameStatus;
  public config!: GameConfiguration;
  public createdByUser!: Ref<User>;

  @Property({ ref: 'PresidentsPlayer' })
  @Field((type) => ID, { nullable: true })
  public currentPlayer?: Ref<PresidentsPlayer>;

  @Property({ ref: 'PresidentsPlayer' })
  @Field((type) => ID, { nullable: true })
  public winningPlayer?: Ref<PresidentsPlayer>;

  @Property({ type: PresidentsTurn })
  @Field((type) => PresidentsTurn, { nullable: true })
  public turnToBeat?: PresidentsTurn;

  @Property({ type: PresidentsRound, required: true })
  @Field((type) => [PresidentsRound])
  public rounds!: PresidentsRound[];

  @Property({ type: PresidentsPlayer, required: true })
  @Field((type) => [PresidentsPlayer])
  public players!: PresidentsPlayer[];


  /**
   * This method will create a PresidentsGame instance.
   * @param input PresidentsGameInput
   * @returns Promise<DocumentType<PresidentsGame>>
   * @public
   * @static
   * @async
   * @automation PresidentsGame.test.ts #createInstance
   */
  public static async createInstance(this: ReturnModelType<typeof PresidentsGame>, input: CreatePresidentsGameInstance) {
    const status = await GameStatusModel.findByValue(StatusValues.NotStarted);
    const config = await GameConfigurationModel.findOne({ name: 'Presidents' });
    const game = {
      name: input.name,
      createdByUser: input.createdByUser,
      config,
      status,
      createdAt: Utils.getDate(),
      drinkRequests: [],
      players: [],
      rounds: [],
    };
    const instance = await this.create(game);
    return instance;
  }

  /**
   * This method will add a PresidentsPlayer to the game from their user ID.
   * @param input userId: Ref<User>
   * @returns DocumentType<PresidentsGame>
   * @public
   * @async
   * @automation PresidentsGame.test.ts #addPlayer
   */
  public async addPlayer(this: DocumentType<PresidentsGame>, userId: string, politicalRank?: PoliticalRank) {
    const user = await UserModel.findById(userId);
    const player = await PresidentsPlayerModel.createInstance({
      user: user._id,
      game: this._id,
      seatPosition: this.players.length,
      politicalRank
    });
    this.players.push(player);
    await this.save();
    return this;
  }

  /**
   * This method will create a PresidentsGame and add a PresidentsPlayer to the game.
   * @param input PresidentsGameInput
   * @returns DocumentType<PresidentsGame>
   * @public
   * @static
   * @async
   * @graphql
   * @automation PresidentsGame.test.ts #CreateGameAndAddPlayer
   */
  public static async CreateGameAndAddPlayer(this: ReturnModelType<typeof PresidentsGame>, input: CreatePresidentsGameRequest) {
    const game = await this.createInstance(input);
    return game.addPlayer(input.createdByUser);
  }

  /**
   * This method will add a user to the game by creating a PresidentsPlayer instance and
   * adding it to the game.
   * @param input JoinGame
   * @returns DocumentType<PresidentsGame>
   * @public
   * @static
   * @async
   * @graphql
   * @automation PresidentsGame.test.ts #CreateGameAndAddPlayer
   */
  public static async JoinGame(this: ReturnModelType<typeof PresidentsGame>, input: JoinPresidentsGameRequest) {
    const game = await this.findById(input.id);

    if (game.status.value === StatusValues.InProgress) {
      return Promise.reject(new PresidentsGameError('Cannot join game. It`s in progress.'));
    }

    if (game.status.value === StatusValues.Finalized) {
      return Promise.reject(new PresidentsGameError('Cannot join game. It`s finished.'));
    }

    if (game.players.length === game.config.maxPlayers) {
      return Promise.reject(new PresidentsGameError('Cannot join game. It is already full.'));
    }

    const hasUserJoined = game.players.find((player) => Utils.areIDsEqual(player.id, input.userId));
    if (hasUserJoined) {
      return Promise.reject(new PresidentsGameError('User has already joined the game.'));
    }

    return game.addPlayer(input.userId);
  }

  /**
   * This method will initialize the game. It deals the cards to players based on their
   * seat position. The current player is set as the player with the 3Clubs.
   * @returns DocumentType<PresidentsGame>
   * @public
   * @async
   * @automation PresidentsGame.test.ts #initialize
   */
  public async initialize(this: DocumentType<PresidentsGame>) {
    if (this.status.value === StatusValues.InProgress) {
      return Promise.reject(new PresidentsGameError('Unable to start game. It is already in progress.'));
    }
    if (this.status.value === StatusValues.Finalized) {
      return Promise.reject(new PresidentsGameError('Unable to start game. It has already finished.'));
    }
    if (this.players.length < this.config.minPlayers) {
      return Promise.reject(
        new PresidentsGameError(`Unable to start game. Minimum number of players is ${this.config.minPlayers}.`)
      );
    }

    let { deck } = this.config;
    const deckInstance = await PresidentsDeckModel.findById(deck);
    const shuffledCards = deckInstance.getShuffledCards();
    const numPlayers = this.players.length;
    const dealtCards = deckInstance.deal(numPlayers, shuffledCards);
    const indexOf3Clubs = deckInstance.find3ClubsIndex(dealtCards);
    this.getOrderedPlayers().forEach((player, idx) => player.cards = dealtCards[idx]);
    this.currentPlayer = this.findPlayerBySeatPosition(indexOf3Clubs);
    await this.save();
    return this;
  }

  /**
   * This method will initialize the next round of the game. It clears the turn to beat
   * if it exists. It will also set the game status to in progress if it is just starting.
   * @returns DocumentType<PresidentsGame>
   * @public
   * @async
   * @automation PresidentsGame.test.ts #initializeNextRound
   */
  public async initializeNextRound(this: DocumentType<PresidentsGame>) {
    if (this.status.value === StatusValues.Finalized) {
      return Promise.reject(new PresidentsGameError('Unable to start next round. The game is finalized.'));
    }
    if (this.status.value === StatusValues.InProgress) {
      if (this.turnToBeat) {
        this.turnToBeat = null;
      }
    }
    if (this.status.value === StatusValues.NotStarted) {
      this.startedAt = Utils.getDate();
      this.status = await GameStatusModel.findOne({ value: StatusValues.InProgress });
    }

    const roundInput = { game: this._id, number: this.rounds.length };
    const roundInstance = await PresidentsRoundModel.createInstance(roundInput);
    this.rounds.push(roundInstance);

    await this.save();
    return this;
  }

  /**
   * This method will start the game. It initializes it, and initializes the first round.
   * @param input StartGame
   * @returns Promise<PresidentsGame>
   * @public
   * @static
   * @async
   * @graphql
   * @automation PresidentsGame.test.ts #StartGame
   */
  public static async StartGame(this: ReturnModelType<typeof PresidentsGame>, id: string) {
    const game = await this.findById(id);
    await game.initialize();
    return game.initializeNextRound();
  }

  /**
   * This method will get the players ordered by seat position.
   * @returns PresidentsPlayer[]
   * @private
   * @automation PresidentsGame.test.ts #StartGame
   */
  private getOrderedPlayers(this: DocumentType<PresidentsGame>) {
    return this.players.sort((a, b) => (a.seatPosition > b.seatPosition ? 1 : -1));
  }

  /**
   * This method will find a player by their seat position.
   * @param seatPositionWith3Clubs number
   * @returns PresidentsPlayer
   * @private
   * @automation PresidentsGame.test.ts #StartGame
   */
  public findPlayerBySeatPosition(this: DocumentType<PresidentsGame>, seatPositionWith3Clubs: number) {
    return this.players.find((player) => player.seatPosition === seatPositionWith3Clubs);
  }

  /**
   * This method will create a PresidentsTurn instance.
   * @param input AddPresidentsTurnInput
   * @returns DocumentType<PresidentsGame>
   * @public
   * @static
   * @async
   * @automation PresidentsGame.test.ts #AddPresidentsTurn
   */
  public async createPresidentsTurn(this: DocumentType<PresidentsGame>, turn: AddPresidentsTurnInput) {
    const presidentsTurn = {
      forPlayer: turn.forPlayer,
      cardsPlayed: turn.cardsPlayed,
      wasPassed: turn.wasPassed,
      endedRound: !!turn.cardsPlayed.find(card => card.cardRank.value === 2),
      wasSkipped: false,
      didCauseSkips: false,
      skipsRemaining: 0,
    };
    presidentsTurn.skipsRemaining = PresidentsTurnModel.calculateSkips(this?.turnToBeat?.cardsPlayed, turn.cardsPlayed);
    presidentsTurn.didCauseSkips = presidentsTurn.skipsRemaining > 0;
    const presidentsTurnInstance = await PresidentsTurnModel.createInstance(presidentsTurn);
  return presidentsTurnInstance;
  }

  /**
   * This method will create a skipped PresidentsTurn instance.
   * @param skipsRemaining number
   * @returns DocumentType<PresidentsGame>
   * @public
   * @static
   * @async
   * @automation PresidentsGame.test.ts #AddPresidentsTurn
   */
  public async createSkipTurn(this: DocumentType<PresidentsGame>, skipsRemaining: number) {
    const skipTurn = {
      forPlayer: this.currentPlayer,
      cardsPlayed: [],
      wasPassed: false,
      endedRound: false,
      wasSkipped: true,
      didCauseSkips: false,
      skipsRemaining,
    };
    const presidentsTurnInstance = await PresidentsTurnModel.createInstance(skipTurn);
    return presidentsTurnInstance;
  }

  public isFirstTurnOfTheGame(this: DocumentType<PresidentsGame>) {
    return this.rounds.length === 1 && this.rounds[0].turns.length === 0;
  }

  public isFirstTurnOfCurrentRound(this: DocumentType<PresidentsGame>) {
    return this.rounds[this.rounds.length - 1].turns.length === 0;
  }

  /**
   * This method will add a PresidentsTurn instance to the current round.
   * It first validates the turn, and if it is valid it adds it to the 
   * latest round. After setting the next player, we check if the previous 
   * turn caused any skips and add those as well. At the end we check to see 
   * if we need to create the next round.
   * @param turn AddPresidentsTurnRequest
   * @returns DocumentType<PresidentsGame>
   * @public
   * @static
   * @async
   * @graphql
   * @automation PresidentsGame.test.ts #AddPresidentsTurn
   */
  public static async AddPresidentsTurn(this: ReturnModelType<typeof PresidentsGame>, turn: AddPresidentsTurnRequest) {
    const game = await this.findById(turn.id);
    const forPlayer = game.players.find(player => Utils.areIDsEqual(player.id, turn.forPlayer));
    const cardsPlayed = forPlayer.cards.filter(card => turn.cardsPlayed.find(c => Utils.areIDsEqual(c, card.id)));
    const { wasPassed } = turn;
    const turnInput: AddPresidentsTurnInput = { 
      forPlayer: forPlayer._id, 
      cardsPlayed, 
      wasPassed 
    };
    return game.addPresidentsTurn(turnInput);
  }

  /**
   * IF the turn is valid
   * CREATE the turn
   * ADD turn to current round
   * IF a two was plaued
   * INITIALIZE the next round
   * UPDATE turn to beat
   * UPDATE current player
   * IF turn caused skips
   * ADD skip turns to current round and update current player
   * REMOVE cards from players hand
   * IF player has no cards left
   * SET player's next round rank
   * IF only one other player now has cards
   * SET their next round rank
   * FINALIZE the game
   * @param turn AddPresidentsTurnInput
   * @returns DocumentType<PresidentsGame>
   * @public
   * @static
   * @async
   * @graphql
   * @automation PresidentsGame.test.ts #AddPresidentsTurn
   */
  public async addPresidentsTurn(this: DocumentType<PresidentsGame>, turn: AddPresidentsTurnInput) {
    const gameData: GameDataForTurnValidation = {
      currentPlayer: this.currentPlayer,
      isFirstTurnOfTheGame: this.isFirstTurnOfTheGame(),
      isFirstTurnOfCurrentRound: this.isFirstTurnOfCurrentRound(),
      cardsToBeat: this?.turnToBeat?.cardsPlayed || [],
    };
    const validTurn = PresidentsTurnModel.isValidTurn(gameData, turn);
    if (validTurn) {
      const presidentsTurnInstance = await this.createPresidentsTurn(turn);
      const currentRound = this.rounds[this.rounds.length - 1];
      currentRound.turns.push(presidentsTurnInstance);
      const playedATwo = presidentsTurnInstance.cardsPlayed.find(card => card.cardRank.value === 2);
      if (playedATwo) {
        return this.initializeNextRound();
      }
      this.turnToBeat = presidentsTurnInstance;
      this.currentPlayer = this.getNextPlayerId();
      if (presidentsTurnInstance.didCauseSkips) {
        let { skipsRemaining } = presidentsTurnInstance;
        while (skipsRemaining) {
          skipsRemaining--;
          const skipTurn = await this.createSkipTurn(skipsRemaining);
          currentRound.turns.push(skipTurn);
          this.currentPlayer = this.getNextPlayerId();
        }
      }
      const player = this.players.find(player => Utils.areIDsEqual(player._id, presidentsTurnInstance.forPlayer));
      player.cards = player.cards.filter(card => turn.cardsPlayed.find(c => !Utils.areIDsEqual(c._id, card._id)));
      if (player.cards.length === 0) {
        const playersWithNoCards = this.players.filter(player => player.cards.length === 0);
        player.nextGameRank = await PoliticalRankModel.findOne({ value: playersWithNoCards.length });
        if (playersWithNoCards.length === 1) {
          const playerWithCards = this.players.find(player => player.cards.length > 0);
          playerWithCards.nextGameRank = await PoliticalRankModel.findOne({ value: playersWithNoCards.length + 1 });
          this.status = await GameStatus.findByValue(StatusValues.Finalized);
          this.finishedAt = Utils.getDate();
        }
      }
      if (this.status.value === StatusValues.InProgress) {
        let { isRoundOver, turn } = this.isRoundOver();
        if (isRoundOver) {
          turn.endedRound = true;
          await this.initializeNextRound();
        }
      }
      
      await this.save();
      return this;
    }
  }

  /**
   * This method will determine if the round is over, ie. the current player's last turn ended the round.
   * We do this when, for one example, everyone passes after a players turn and it's now
   * their turn again. We need to know this so we can add a new round.
   * 
   * IF not all players have taken a turn => false
   * FIND current players last turn taken
   * IF we found one and a 2 was played => true
   * IF we did not find that turn => false
   * IF we found one and it was a pass => false
   * IF we found one and it was a self skip => true
   * IF we found one and it was a skip by someone else => false
   * IF every turn after was a skip or pass => true
   * ELSE someone played a turn after => false
   * @returns Promise<boolean>
   * @public
   * @static
   * @automation PresidentsGame.test.ts #isRoundOver
   */
  public isRoundOver(this: DocumentType<PresidentsGame>): RoundEndTurnData {
    let latestRound = this.rounds[this.rounds.length - 1];
    let playersLastTurnIdx;
    let searchingForLastTurn = true;
    let foundLastTurn = false;

    // not all players have taken a turn
    if (latestRound.turns.length < this.players.length) {
      return {isRoundOver: false, turn: null};
    }

    let turn;
    let i = latestRound.turns.length;
    while (searchingForLastTurn) {
      i--;
      // work from the most recent turn taken backwards
      turn = latestRound.turns[i];
      if (Utils.areIDsEqual(this.currentPlayer, turn.forPlayer)) {
        playersLastTurnIdx = i;
        searchingForLastTurn = false;
        foundLastTurn = true;
      }
    }

    // if we found a turn and it contained a 2 they ended the round
    if (turn.cardsPlayed.find((card) => card.cardRank.value === 2)) {
      return {isRoundOver: true, turn};
    }

    // we didn't find one
    if (!foundLastTurn) {
      return {isRoundOver: false, turn: null};
    }

    // we found one, did it end the round?
    let turns = latestRound.turns.slice(playersLastTurnIdx);
    let playersLastTurn = turns[0];
    // they passed
    if (playersLastTurn.wasPassed) {
      return {isRoundOver: false, turn: null};
    }
    // they could've been skipped
    if (playersLastTurn.wasSkipped) {
      let searchingForWhoCausedSkip = true;
      while (searchingForWhoCausedSkip) {
        i--;
        let turn = latestRound.turns[i];
        if (turn.didCauseSkips) {
          // but if they skipped themself, and now it's back to them they're good
          if (Utils.areIDsEqual(this.currentPlayer, turn.forPlayer)) {
            return {isRoundOver: true, turn: playersLastTurn};
          }
          // if they didn't skip themself, they didn't end the round
          return {isRoundOver: false, turn: null};
        }
      }
      // if they didn't skip themself, they didn't end the round
      return {isRoundOver: false, turn: null};
    }

    i = 1;
    let checkingForSkips = true;

    // did everyone after this player skip or pass?
    while (checkingForSkips && i < turns.length) {
      let turn = turns[i];
      if (!turn.wasSkipped) {
        checkingForSkips = false;
      } else {
        i++;
      }
    }

    let checkingForPasses = true;
    while (checkingForPasses && i < turns.length) {
      let turn = turns[i];
      if (!turn.wasPassed) {
        return {isRoundOver: false, turn: null};
      } else {
        i++;
      }
    }

    // they played a turn so good nobody could beat it
    return {isRoundOver: true, turn: playersLastTurn};
  }

  /**
   * This method will get the next player based on seat position.
   * @returns Ref<PresidentsPlayer>
   * @public
   * @async
   * @automation PresidentsGame.test.ts #getNextPlayer
   */
  public getNextPlayerId(this: DocumentType<PresidentsGame>): ObjectId {
    const currentPlayer = this.players.find((player) => Utils.areIDsEqual(player._id, this.currentPlayer));
    const currentSeatPosition = currentPlayer.seatPosition;
    let nextSeatPosition = (currentSeatPosition + 1) % this.players.length;
    let searching = true;
    let nextPlayer;

    while (searching) {
      nextPlayer = this.findPlayerBySeatPosition(nextSeatPosition);
      if (nextPlayer?.nextGameRank) {
        nextSeatPosition = (nextSeatPosition + 1) % this.players.length;
      } else {
        searching = false;
      }
    }

    return nextPlayer._id;
  }

  /**
   * This method will initialize a rematch game.
   * @param id string
   * @returns Promise<DocumentType<PresidentsGame>>>
   * @public
   * @static
   * @async
   * @graphql
   * @automation PresidentsGame.test.ts #Rematch
   */
  public static async Rematch(this: ReturnModelType<typeof PresidentsGame>, id: string) {
    let game = await this.findById(id);
    let { createdByUser, config } = game;
    let players = game.getOrderedPlayers();
    let usersToAdd = players.map(({ user, nextGameRank, seatPosition }) => ({ _id: user, nextGameRank, seatPosition }));
    let name = `${game.name}-rematch-${Utils.getObjectId()}`;
    const gameInput = { name, createdByUser: createdByUser.toString(), config };
    let newGame = await this.createInstance(gameInput);
    // sus
    for (let user of usersToAdd) {
      newGame = await newGame.addPlayer(user._id.toString(), user.nextGameRank);
    }
    newGame = await newGame.initialize();
    return newGame.initializeNextRound();
  }

  /**
   * This method will fulfill a drink request created in the game.
   * @param id string
   * @returns Promise<DocumentType<PresidentsGame>>>
   * @public
   * @static
   * @async
   * @graphql
   * @automation PresidentsGame.test.ts #FulfillDrinkRequest
   */
  public static async FulfillDrinkRequest(this: ReturnModelType<typeof PresidentsGame>, input: FulfillDrinkRequestRequest) {
    let game = await this.findById(input.id);
    const receiver = game.players.find(player => Utils.areIDsEqual(player._id, input.forPlayer));
    const drinkReceived = receiver.drinkRequestsReceived.find(drink => Utils.areIDsEqual(drink._id, input.drinkId));
    const now = Utils.getDate();
    drinkReceived.fulfilled = true;
    drinkReceived.fulfilledAt = now;
    const sender = game.players.find(player => Utils.areIDsEqual(player._id, drinkReceived.fromPlayer));
    const drinkSent = sender.drinkRequestsSent.find(drink => Utils.areIDsEqual(drink._id, input.drinkId));
    drinkSent.fulfilled = true;
    drinkSent.fulfilledAt = now;
    await game.save();
    return game;
  }

  /**
   * This method will send a drink request from one player to another.
   * IF the players do not have ranks yet => reject
   * IF the player sending does not out rank the receiver => reject
   * IF the receiver has an unfulfilled drink from the sender => reject
   * @param input SendDrinkRequestInput
   * @returns Promise<DocumentType<PresidentsGame>>>
   * @public
   * @static
   * @async
   * @graphql
   * @automation PresidentsGame.test.ts #SendDrinkRequest
   */
  public static async SendDrinkRequest(this: ReturnModelType<typeof PresidentsGame>, input: SendDrinkRequestRequest) {
    let game = await this.findById(input.id);
    const fromPlayerInstance = game.players.find(player => Utils.areIDsEqual(player._id, input.fromPlayer));
    const toPlayerInstance = game.players.find(player => Utils.areIDsEqual(player._id, input.toPlayer));

    if (!fromPlayerInstance.politicalRank || !toPlayerInstance.politicalRank) {
      return Promise.reject(new PresidentsGameError('you must wait til all players have ranks to give drinks out'));
    }

    const doesGiverOutRankReceiver = fromPlayerInstance.politicalRank.value < fromPlayerInstance.politicalRank.value;
    if (doesGiverOutRankReceiver) {
      return Promise.reject(new PresidentsGameError('fromPlayer must out rank toPlayer in order to give a drink'));
    }
    const unfulfilledDrinksFromSender = toPlayerInstance.drinkRequestsReceived
      .filter(drink => !drink.fulfilled)
      .filter(drink => Utils.areIDsEqual(drink.fromPlayer, fromPlayerInstance._id));
    if (unfulfilledDrinksFromSender.length > 0) {
      return Promise.reject(new PresidentsGameError('toPlayer already has a drink to drink from fromPlayer. you can\'t give another'));
    }

    const requestInstance = await DrinkRequestModel.createInstance({
      fromPlayer: fromPlayerInstance._id,
      toPlayer: toPlayerInstance._id,
      game: game._id,
      message: input.message
    });

    fromPlayerInstance.drinkRequestsSent.push(requestInstance);
    toPlayerInstance.drinkRequestsReceived.push(requestInstance);
    await game.save();
    return game;
  }
}
