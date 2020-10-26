import { AddPresidentsTurnInput, JoinPresidentsGameInput } from './PresidentsGame.inputs';
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
} from '../../../core';
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
import { PresidentsDeck, PresidentsDeckModel } from '../PresidentsDeck';
import { PresidentsPlayer, PresidentsPlayerModel } from '../PresidentsPlayer';
import { PresidentsRound, PresidentsRoundModel } from '../PresidentsRound';
import { PresidentsTurn, PresidentsTurnModel } from '../PresidentsTurn';

import { InstanceId } from '../../../../types';
import { PresidentsGameError } from './errors';
import { PresidentsGameInput } from './PresidentsGame.inputs';
import { PresidentsTurnInput } from '../PresidentsTurn/PresidentsTurn.input';
import { SendDrinkRequestInput } from './../DrinkRequest/DrinkRequest.input';
import { StatusValues } from '../../../../types';
import { Utils } from '../../../modules.utils';

/**
 * This class represents a PresidentsGame.
 * @extends Game
 * @public
 *
 */
@ModelOptions(Utils.getDisciminatorModelOptions())
@ObjectType({ implements: [Instance, Game] })
export default class PresidentsGame extends Game {
  public _id!: InstanceId;
  public id!: string;
  public name!: string;
  public createdAt!: Date;
  public startedAt?: Date;
  public finishedAt?: Date;
  public status!: GameStatus;
  public config!: GameConfiguration;
  public createdByUser!: Ref<User>;
  public currentPlayer?: Ref<Player>;

  @Property({ ref: 'PresidentsPlayer' })
  @Field((type) => ID)
  public winningPlayer?: Ref<PresidentsPlayer>;

  @Property({ type: PresidentsTurn })
  @Field((type) => PresidentsTurn)
  public turnToBeat?: PresidentsTurn;

  @Property({ type: PresidentsRound, required: true })
  @Field((type) => [PresidentsRound])
  public rounds!: PresidentsRound[];

  @Property({ type: PresidentsPlayer, required: true })
  @Field((type) => [PresidentsPlayer])
  public players!: PresidentsPlayer[];

  @Property({ type: DrinkRequest, required: true })
  @Field((type) => [DrinkRequest])
  public drinkRequests!: DrinkRequest[];

  /**
   * This method will create a PresidentsGame instance.
   * @param input PresidentsGameInput
   * @returns Promise<DocumentType<PresidentsGame>>
   * @public
   * @static
   * @async
   * @automation PresidentsGame.test.ts #createInstance
   */
  public static async createInstance(this: ReturnModelType<typeof PresidentsGame>, input: PresidentsGameInput) {
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
   * @automation PresidentsGame.test.ts #addPlayerFromUserId
   */
  public async addPlayerFromUserId(this: DocumentType<PresidentsGame>, userId: Ref<User>) {
    const player = await PresidentsPlayerModel.createInstance({
      user: userId,
      game: this._id,
      seatPosition: this.players.length,
    });
    return this.addPlayer(player);
  }

  /**
   * This method will add a PresidentsPlayer document to the players list.
   * @param input player: DocumentType<PresidentsPlayer>
   * @returns DocumentType<PresidentsGame>
   * @public
   * @async
   * @automation PresidentsGame.test.ts #addPlayerFromUserId
   */
  public async addPlayer(this: DocumentType<PresidentsGame>, player: DocumentType<PresidentsPlayer>) {
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
   * @automation PresidentsGame.test.ts #CreateGameAndAddPlayer
   */
  public static async CreateGameAndAddPlayer(this: ReturnModelType<typeof PresidentsGame>, input: PresidentsGameInput) {
    const game = await this.createInstance(input);
    return await game.addPlayerFromUserId(input.createdByUser);
  }

  /**
   * This method will add a user to the game by creating a PresidentsPlayer instance and
   * adding it to the game.
   * @param input JoinGame
   * @returns DocumentType<PresidentsGame>
   * @public
   * @static
   * @async
   * @automation PresidentsGame.test.ts #CreateGameAndAddPlayer
   */
  public static async JoinGame(this: ReturnModelType<typeof PresidentsGame>, input: JoinPresidentsGameInput) {
    const game = await this.findById(input.id);

    if (game.status.value === 'IN_PROGRESS') {
      return Promise.reject(new PresidentsGameError('Cannot join game. It`s in progress.'));
    }

    if (game.status.value === 'FINALIZED') {
      return Promise.reject(new PresidentsGameError('Cannot join game. It`s finished.'));
    }

    if (game.players.length === game.config.maxPlayers) {
      return Promise.reject(new PresidentsGameError('Cannot join game. It is already full.'));
    }

    const hasUserJoined = game.players.find((player) => player._id === input.userId);
    if (hasUserJoined) {
      return Promise.reject(new PresidentsGameError('User has already joined the game.'));
    }

    return game.addPlayerFromUserId(input.userId);
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
    if (this.players.length === this.config.maxPlayers) {
      return Promise.reject(
        new PresidentsGameError(
          `Unable to start game. The maximum amount of players (${this.config.maxPlayers}) has been reached.`
        )
      );
    }

    let { deck } = this.config;
    const deckInstance = await PresidentsDeckModel.findById(deck);
    const shuffledCards = deckInstance.getShuffledCards();
    const numPlayers = this.players.length;
    const dealtCards = deckInstance.deal(numPlayers, shuffledCards);
    const indexOf3Clubs = deckInstance.find3ClubsIndex(dealtCards);
    const players = await PresidentsPlayerModel.findManyByIds(this.getOrderedPlayers());
    // are they really ordered though?
    const playerUpdatePromises = players.map((player: DocumentType<PresidentsPlayer>, idx) => player.setCards(dealtCards[idx]));
    const playerInstances = await Promise.all(playerUpdatePromises);
    this.players = playerInstances;
    const currentPlayer = this.findPlayerBySeatPosition(indexOf3Clubs);
    this.currentPlayer = currentPlayer;
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
        this.turnToBeat = undefined;
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
   * @automation PresidentsGame.test.ts #StartGame
   */
  public static async StartGame(this: ReturnModelType<typeof PresidentsGame>, id: string) {
    let game = await this.findById(id);
    game = await game.initialize();
    return game.initializeNextRound();
  }

  /**
   * This method will get the players ordered by seat position.
   * @returns PresidentsPlayer[]
   * @private
   * @automation PresidentsGame.test.ts #StartGame
   */
  private getOrderedPlayers(this: DocumentType<PresidentsGame>) {
    return this.players.sort((a, b) => (a.seatPosition > b.seatPosition ? 1 : -1)).map((player) => player._id);
  }

  /**
   * This method will find a player by their seat position.
   * @param seatPositionWith3Clubs number
   * @returns PresidentsPlayer
   * @private
   * @automation PresidentsGame.test.ts #StartGame
   */
  private findPlayerBySeatPosition(this: DocumentType<PresidentsGame>, seatPositionWith3Clubs: number) {
    return this.players.find((player) => player.seatPosition === seatPositionWith3Clubs);
  }

  /**
   * This method will set the current player to the reference.
   * @param player Ref<PresidentsPlayer>
   * @returns DocumentType<PresidentsGame>
   * @private
   * @async
   * @automation PresidentsGame.test.ts #StartGame
   */
  private async setCurrentPlayer(this: DocumentType<PresidentsGame>, player: Ref<PresidentsPlayer>) {
    this.currentPlayer = player;
    await this.save();
    return this;
  }

  /**
   * This method will calculate how many skips the cards would cause if they were played.
   * @param cardsPlayed Card[]
   * @returns number 0-4
   * @public
   * @async
   * @automation PresidentsGame.test.ts #calculateSkips
   */
  public async calculateSkips(this: DocumentType<PresidentsGame>, cardsPlayed: InstanceId[]) {
    const cards = await CardModel.findManyByIds(cardsPlayed);
    // first hand of the game there will be no handToBeat
    if (this.turnToBeat === null) {
      return 0;
    }
    // assume cards are valid and cards are better
    const handToBeatCardRankValue = this.turnToBeat[0].cardRank.value;
    const cardRankValue = cards[0].cardRank.value;
    if (handToBeatCardRankValue === cardRankValue) {
      if (this.turnToBeat.cardsPlayed.length === cards.length) {
        return 1;
      } else {
        let result = 1 + cardsPlayed.length - this.turnToBeat.cardsPlayed.length;
        return result;
      }
    }
    return 0;
  }

  /**
   * This method will create a PresidentsTurn instance.
   * @param input PresidentsTurnInput
   * @returns DocumentType<PresidentsGame>
   * @public
   * @static
   * @async
   * @automation PresidentsGame.test.ts #AddPresidentsTurn
   */
  public async createPresidentsTurn(this: DocumentType<PresidentsGame>, turn: PresidentsTurnInput) {
    const { wasPassed } = turn;
    const forPlayer = await PresidentsPlayerModel.findById(turn.forPlayer);
    const presidentsTurn = {
      forPlayer,
      cardsPlayed: turn.cardsPlayed,
      wasPassed,
      endedRound: false,
      wasSkipped: false,
      didCauseSkips: false,
      skipsRemaining: 0,
    };
    presidentsTurn.skipsRemaining = await this.calculateSkips(turn.cardsPlayed);
    presidentsTurn.didCauseSkips = presidentsTurn.skipsRemaining > 0;
    const presidentsTurnInstance = await PresidentsTurnModel.createInstance(presidentsTurn);
    return presidentsTurnInstance;
  }

  /**
   * This method will create a skipped PresidentsTurn instance.
   * @param input PresidentsTurnInput
   * @returns DocumentType<PresidentsGame>
   * @public
   * @static
   * @async
   * @automation PresidentsGame.test.ts #AddPresidentsTurn
   */
  public async createSkipTurn(this: DocumentType<PresidentsGame>, skipsRemaining: number) {
    const skipTurn = {
      forPlayer: this.currentPlayer as Ref<PresidentsPlayer>,
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

  /**
   * This method will add a PresidentsTurn instance to the current round.
   * @param input PresidentsTurnInput
   * @returns DocumentType<PresidentsGame>
   * @public
   * @static
   * @async
   * @automation PresidentsGame.test.ts #AddPresidentsTurn
   */
  public static async AddPresidentsTurn(this: ReturnModelType<typeof PresidentsGame>, id: string, turn: PresidentsTurnInput) {
    let game = await this.findById(id);
    const validTurn = await game.isValidTurn(turn);

    if (validTurn) {
      const presidentsTurnInstance = await game.createPresidentsTurn(turn);
      const currentRoundIndex = game.rounds.length - 1;
      game.rounds[currentRoundIndex].turns.push(presidentsTurnInstance);
      game.currentPlayer = game.getNextPlayerId();

      if (presidentsTurnInstance.didCauseSkips) {
        let { skipsRemaining } = presidentsTurnInstance;
        while (skipsRemaining) {
          skipsRemaining--;
          const skipTurn = await game.createSkipTurn(skipsRemaining);
          game.rounds[currentRoundIndex].turns.push(skipTurn);
          game.currentPlayer = game.getNextPlayerId();
        }
      }

      if (game.status.value === StatusValues.InProgress) {
        let didCurrentPlayersLastTurnEndTheRound = game.didCurrentPlayersLastTurnEndTheRound();
        if (didCurrentPlayersLastTurnEndTheRound) {
          await game.initializeNextRound();
        }
      }

      let instance = await game.save();
      return instance;
    }
  }

  /**
   * This method will validate the turn submitted.
   * @param turn PresidentsTurnInput
   * @returns Promise<boolean>
   * @public
   * @async
   * @automation PresidentsGame.test.ts #isValidTurn
   */
  public async isValidTurn(this: DocumentType<PresidentsGame>, turn: PresidentsTurnInput) {
    const player = await PresidentsPlayerModel.findById(turn.forPlayer);
    const cardInstances = await CardModel.findManyByIds(turn.cardsPlayed);
    const turnToBeatCards = this.turnToBeat.cardsPlayed || [];
    const isPlayersTurn = player._id === this.currentPlayer;
    const isPlayingCards = turn.cardsPlayed.length > 0;

    if (!isPlayersTurn) {
      return Promise.reject(new PresidentsGameError(`Unable to process turn. It is not your turn.`));
    }
    if (isPlayersTurn && turn.wasPassed) {
      return Promise.resolve(true);
    }
    if (isPlayersTurn && !turn.wasPassed) {
      // Is the current hand valid (all ranks the same)?
      const areCardsValid = await this.areCardsValid(cardInstances);
      if (areCardsValid) {
        return Promise.reject(new PresidentsGameError(`Cannot process an invalid turn. The cards selected are invalid.`));
      }
      const isFirstTurnOfTheGame = this.rounds.length === 1 && this.rounds[0].turns.length === 0;
      if (isFirstTurnOfTheGame) {
        const contains3Clubs = cardInstances.find((card) => card.shortHand === '3Clubs');
        if (contains3Clubs) {
          return Promise.resolve(true);
        }
        return Promise.reject(new PresidentsGameError(`First turn of the game must contain a 3 of clubs.`));
      }
      const isFirstTurnOfCurrentRound = this.rounds[this.rounds.length - 1].turns.length === 0;
      if (isFirstTurnOfCurrentRound) {
        return Promise.resolve(true);
      }
      // it's a turn in the middle of the round, see if it's better than the last
      if (this.turnToBeat === undefined) {
        return Promise.resolve(true);
      } else {
        const areCardsBetter = await this.areCardsBetter(cardInstances);
        if (areCardsBetter) {
          return Promise.resolve(true);
        } else {
          return Promise.reject(
            new PresidentsGameError(`Cannot process an invalid turn. Your cards are not better than the last hand.`)
          );
        }
      }
    }
  }

  /**
   * This method will validate the cards submitted in a turn.
   * @param cardsPlayed Card[]
   * @returns Promise<boolean>
   * @public
   * @static
   * @async
   * @automation PresidentsGame.test.ts #areCardsValid
   */
  public async areCardsValid(this: DocumentType<PresidentsGame>, cardsPlayed: Card[]) {
    const currentHandCardRankValues = cardsPlayed.map((card) => card.cardRank.value);
    const rankValue = currentHandCardRankValues[0];
    const areCardsValid = currentHandCardRankValues.every((cardRankValue) => cardRankValue === rankValue);
    return areCardsValid;
  }

  /**
   * This method will check if the cards submitted in a turn are better
   * than the current turn to beat.
   * @param cardsPlayed Card[]
   * @returns Promise<boolean>
   * @public
   * @static
   * @async
   * @automation PresidentsGame.test.ts #areCardsBetter
   */
  public async areCardsBetter(this: DocumentType<PresidentsGame>, cardsPlayed: Card[]) {
    const handToBeatCardRankValues = this.turnToBeat.cardsPlayed.map((card) => card.cardRank.value);
    const currentHandCardRankValues = cardsPlayed.map((card) => card.cardRank.value);

    const doesContainTwo = !!currentHandCardRankValues.find((value) => value === 2);
    if (doesContainTwo) {
      return Promise.resolve(true);
    }

    const doesCurrentHandHaveMoreCards = currentHandCardRankValues.length > handToBeatCardRankValues.length;
    if (doesCurrentHandHaveMoreCards) {
      return Promise.resolve(true);
    }

    const areNumberOfCardsEqual = currentHandCardRankValues.length === handToBeatCardRankValues.length;
    if (areNumberOfCardsEqual) {
      const areCardsSameRank = currentHandCardRankValues[0] === handToBeatCardRankValues[0];
      if (areCardsSameRank) {
        return Promise.resolve(true);
      }
      const doesCurrentHandRankBeatPrevious = currentHandCardRankValues[0] > handToBeatCardRankValues[0];
      if (doesCurrentHandRankBeatPrevious) {
        return Promise.resolve(true);
      } else {
        return Promise.reject(new PresidentsGameError(`The rank of the selected cards does not beat the previous turns.`));
      }
    } else {
      return Promise.reject(new PresidentsGameError(`The rank of the selected cards does not beat the previous turns.`));
    }
  }

  /**
   * This method will determine if the current player's last turn ended the round.
   * We do this when, for example, everyone passes after a players turn and it's now
   * their turn again. We need to know this so we can add a new round.
   * @returns Promise<boolean>
   * @public
   * @static
   * @async
   * @automation PresidentsGame.test.ts #didCurrentPlayersLastTurnEndTheRound
   */
  public async didCurrentPlayersLastTurnEndTheRound(this: DocumentType<PresidentsGame>) {
    let latestRound = this.rounds[this.rounds.length - 1];
    let playersLastTurnIdx;
    let searchingForLastTurn = true;
    let foundLastTurn = false;
    let i = latestRound.turns.length;

    if (i < this.players.length) {
      return false;
    }

    let turn;
    while (searchingForLastTurn) {
      i--;
      turn = latestRound.turns[i];
      if (this.currentPlayer === turn.forPlayer) {
        playersLastTurnIdx = i;
        searchingForLastTurn = false;
        foundLastTurn = true;
      }
    }

    if (turn.cardsPlayed.find((card) => card.cardRank.value === 2)) {
      return true;
    }
    if (!foundLastTurn) {
      return false;
    }

    let turns = latestRound.turns.slice(playersLastTurnIdx);
    let playersLastTurn = turns[0];
    if (playersLastTurn.wasSkipped) {
      let searchingForWhoCausedSkip = true;
      while (searchingForWhoCausedSkip) {
        i--;
        let turn = latestRound.turns[i];
        if (turn.didCauseSkips) {
          if (this.currentPlayer === turn.forPlayer) {
            return true;
          }
          return false;
        }
      }

      return false;
    }
    if (playersLastTurn.wasPassed) {
      return false;
    }

    i = 1;
    let checkingForSkips = true;

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
        return false;
      } else {
        i++;
      }
    }

    return true;
  }

  /**
   * This method will get the next player based on seat position.
   * @returns Ref<PresidentsPlayer>
   * @public
   * @async
   * @automation PresidentsGame.test.ts #getNextPlayer
   */
  public getNextPlayerId(this: DocumentType<PresidentsGame>) {
    const currentPlayer = this.players.find((player) => player.user === this.currentPlayer);
    const currentSeatPosition = currentPlayer.seatPosition;
    let nextSeatPosition = (currentSeatPosition + 1) % this.players.length;
    let searching = true;
    let nextPlayer;

    while (searching) {
      nextPlayer = this.players.find((player) => player.seatPosition === nextSeatPosition);
      if (nextPlayer?.nextGameRank) {
        nextSeatPosition = (nextSeatPosition + 1) % this.players.length;
      } else {
        searching = false;
      }
    }

    return nextPlayer._id;
  }

  /**
   * This method will calculate how many skips the cards would cause if they were played.
   * @param id string
   * @returns Promise<DocumentType<PresidentsGame>>>
   * @public
   * @static
   * @async
   * @automation PresidentsGame.test.ts #Rematch
   */
  public static async Rematch(this: ReturnModelType<typeof PresidentsGame>, id: string) {
    let game = await this.findById(id);
    let { createdByUser, config } = game;
    let players = game.players.sort((a, b) => (a.seatPosition < b.seatPosition ? 1 : -1));
    let usersToAdd = players.map(({ user, nextGameRank }) => ({ _id: user, nextGameRank }));
    let name = `${game.name}-rematch-${Utils.getObjectId()}`;
    const gameInput = { name, createdByUser, config };
    let newGame = await this.createInstance(gameInput);
    await Promise.all(usersToAdd.map(async (user) => newGame.addPlayerFromUserId(user._id)));
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
   * @automation PresidentsGame.test.ts #FulfillDrinkRequest
   */
  public static async FulfillDrinkRequest(this: ReturnModelType<typeof PresidentsGame>, id: string) {
    const drinkRequest = await DrinkRequestModel.findById(id);
    const player = await PresidentsPlayerModel.findById(drinkRequest.toPlayer);
    // TODO -- validate()
    const hasDrinksToDrink = player.drinkRequestsReceived.length - player.drinksDrunk === 0;
    if (hasDrinksToDrink) {
      return Promise.reject(new PresidentsGameError('Unable to drink any drinks. User has none to drink.'));
    }
    // TODO
    await player.drinkDrink();
    return await drinkRequest.fulfill();
  }

  /**
   * This method will calculate how many skips the cards would cause if they were played.
   * @param input SendDrinkRequestInput
   * @returns Promise<DocumentType<PresidentsGame>>>
   * @public
   * @static
   * @async
   * @automation PresidentsGame.test.ts #SendDrinkRequest
   */
  public static async SendDrinkRequest(this: ReturnModelType<typeof PresidentsGame>, input: SendDrinkRequestInput) {
    let game = await this.findById(input.id);
    const fromPlayerInstance = await PresidentsPlayerModel.findById(input.fromPlayer);
    const toPlayerInstance = await PresidentsPlayerModel.findById(input.toPlayer);

    // TODO -- validate()
    if (!fromPlayerInstance.politicalRank || !toPlayerInstance.politicalRank) {
      return Promise.reject(new PresidentsGameError('you must wait til all players have ranks to give drinks out'));
    }
    const doesGiverOutRankReceiver = fromPlayerInstance.politicalRank.value < fromPlayerInstance.politicalRank.value;
    if (!doesGiverOutRankReceiver) {
      return Promise.reject(new PresidentsGameError('fromPlayer must out rank toPlayer in order to give a drink'));
    }
    const { drinksDrunk } = toPlayerInstance;
    const doesReceiverHaveDrinksToDrink = toPlayerInstance.drinkRequestsReceived.length - drinksDrunk;
    if (doesReceiverHaveDrinksToDrink) {
      let drinksToDrink = toPlayerInstance.drinkRequestsReceived.slice(drinksDrunk);
      // TODO -- update logic for new model
      // const doesReceiverAlreadyHaveADrinkFromGiver = drinksToDrink.find(drink => drink.sentBy.toString() === fromUserInstance._id.toString());
      // if (doesReceiverAlreadyHaveADrinkFromGiver) {
      //   return Promise.reject(new PresidentsGameError('toPlayer already has a drink to drink from fromPlayer. you can\'t give another'));
      // }
    }

    const requestInstance = await DrinkRequestModel.createInstance({
      fromPlayer: input.fromPlayer,
      toPlayer: input.toPlayer,
      game: game._id,
    });

    await fromPlayerInstance.addDrinkRequestSent(requestInstance);
    await toPlayerInstance.addDrinkRequestReceived(requestInstance);
    await game.addDrinkRequest(requestInstance);
  }

  /**
   * This method will calculate how many skips the cards would cause if they were played.
   * @param request DocumentType<DrinkRequest>
   * @returns Promise<DocumentType<PresidentsGame>>>
   * @public
   * @async
   * @automation PresidentsGame.test.ts #addDrinkRequest
   */
  public async addDrinkRequest(this: DocumentType<PresidentsGame>, request: DocumentType<DrinkRequest>) {
    this.drinkRequests.push(request);
    return await this.save();
  }
}
