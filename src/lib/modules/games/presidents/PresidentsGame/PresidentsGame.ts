import * as autopopulate from 'mongoose-autopopulate';

import { Card, CardModel, Game, GameConfiguration, GameConfigurationModel, GameStatus, GameStatusModel, Player, User, UserModel } from '../../../core';
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
import { GameStatusText, PresidentsGameInput, PresidentsTurnInput } from '../../../../types';
import { PresidentsDeck, PresidentsDeckModel } from '../PresidentsDeck';
import { PresidentsPlayer, PresidentsPlayerModel } from '../PresidentsPlayer';
import { PresidentsRound, PresidentsRoundModel } from '../PresidentsRound';
import { PresidentsTurn, PresidentsTurnModel } from '../PresidentsTurn';

import Instance from '../../../core/Instance';
import { InstanceId } from '../../../../types';
import { JoinPresidentsGameInput } from './PresidentsGame.inputs';
import { PresidentsGameError } from './errors';
import { SendDrinkRequestInput } from './../DrinkRequest/DrinkRequest.input';
import { Utils } from '../../../modules.utils';
import { logger } from './../../../../logger';

/**
 * This class represents a PresidentsGame.
 * @extends Game
 * @public
 * 
 */
@ModelOptions(Utils.getDisciminatorModelOptions())
@Plugin(autopopulate)
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
   * @param input Required parameters to create a PresidentsGame.
   * @returns Promise<PresidentsGame>
   * @public
   * @static
   * @async
   * 
   */
  public static async createInstance(this: ReturnModelType<typeof PresidentsGame>, input: PresidentsGameInput) {
    const status = await GameStatusModel.findByValue(GameStatusText.NotStarted);
    const config = await GameConfigurationModel.findOne({ name: 'Presidents' });
    const game = {
      name: input.name,
      createdByUser: input.createdByUser,
      config,
      status,
      createdAt: Utils.getDate(),
      drinkRequests: [],
      players: [],
      rounds: []
    };
    const instance = await this.create(game);
    return instance;
  }

  public async addPlayerFromUserId(this: DocumentType<PresidentsGame>, userId: Ref<User>) {
    const player = await PresidentsPlayerModel.createInstance({
      user: userId, 
      game: this._id,
      seatPosition: this.players.length
    });
    return this.addPlayer(player);
  }

  public async addPlayer(this: DocumentType<PresidentsGame>, player: DocumentType<PresidentsPlayer>) {
    this.players.push(player);
    await this.save();
    return this;
  }

  public static async CreateGameAndAddPlayer(this: ReturnModelType<typeof PresidentsGame>, input: PresidentsGameInput) {
    const game = await this.createInstance(input);
    return await game.addPlayerFromUserId(input.createdByUser);
  }

  public static async JoinGame(this: ReturnModelType<typeof PresidentsGame>, input: JoinPresidentsGameInput) {
    const game = await this.findById(input.id);
  
    if (game.status.value === 'IN_PROGRESS') {
      return Promise.reject(new PresidentsGameError('Cannot join game. It\`s in progress.'));
    }
    
    if (game.status.value === 'FINALIZED') {
      return Promise.reject(new PresidentsGameError('Cannot join game. It\`s finished.'));
    }
  
    if (game.players.length === game.config.maxPlayers) {
      return Promise.reject(new PresidentsGameError('Cannot join game. It is already full.'));
    }
  
    const hasUserJoined = game.players.find(player => player._id === input.userId);
    if (hasUserJoined) {
      return Promise.reject(new PresidentsGameError('User has already joined the game.'));
    }

    return game.addPlayerFromUserId(input.userId);
  }

  public async initialize(this: DocumentType<PresidentsGame>) {
    if (this.status.value === GameStatusText.InProgress) {
      return Promise.reject(new PresidentsGameError('Unable to start game. It is already in progress.'));
    }
    if (this.status.value === GameStatusText.Finalized) {
      return Promise.reject(new PresidentsGameError('Unable to start game. It has already finished.'));
    }
    if (this.players.length < this.config.minPlayers) {
      return Promise.reject(new PresidentsGameError(`Unable to start game. Minimum number of players is ${this.config.minPlayers}.`));
    }
    if (this.players.length === this.config.maxPlayers) {
      return Promise.reject(
        new PresidentsGameError(`Unable to start game. The maximum amount of players (${this.config.maxPlayers}) has been reached.`)
      );
    }

    let { deck } = this.config;
    const deckInstance = await PresidentsDeckModel.findById(deck);
    const shuffledCards = deckInstance.getShuffledCards();
    const numPlayers = this.players.length;
    const dealtCards = deckInstance.deal(numPlayers, shuffledCards);
    const indexOf3Clubs = deckInstance.find3ClubsIndex(dealtCards);
    const players  = await PresidentsPlayerModel.findManyByIds(this.getOrderedPlayers());
    // are they really ordered though?
    const playerUpdatePromises = players.map((player: DocumentType<PresidentsPlayer>, idx) => player.setCards(dealtCards[idx]))
    const playerInstances = await Promise.all(playerUpdatePromises);
    this.players = playerInstances;
    const currentPlayer = this.findPlayerBySeatPosition(indexOf3Clubs);
    this.currentPlayer = currentPlayer;
    await this.save();
    return this;
  }

  public async initializeNextRound(this: DocumentType<PresidentsGame>) {
    if (this.status.value === GameStatusText.Finalized) {
      return Promise.reject(new PresidentsGameError('Unable to start next round. The game is finalized.'));
    }
    if (this.status.value === GameStatusText.InProgress) {
      if (this.turnToBeat) {
        this.turnToBeat = undefined;
      }
    }
    if (this.status.value === GameStatusText.NotStarted) {
      this.startedAt = Utils.getDate();
      this.status = await GameStatusModel.findOne({ value: GameStatusText.InProgress });
    }

    const roundInput = { game: this._id, number: this.rounds.length }
    const roundInstance = await PresidentsRoundModel.createInstance(roundInput);
    this.rounds.push(roundInstance);

    await this.save();
    return this;
  }

  public static async StartGame(this: ReturnModelType<typeof PresidentsGame>, id: string) {
    let game = await this.findById(id);
    game = await game.initialize();
    return game.initializeNextRound();
  }

  private getOrderedPlayers(this: DocumentType<PresidentsGame>) {
    return this.players
      .sort((a, b) => (a.seatPosition > b.seatPosition ? 1 : -1))
      .map(player => player._id);
  }

  private findPlayerBySeatPosition(this: DocumentType<PresidentsGame>, seatPositionWith3Clubs: number) {
    return this.players.find((player) => player.seatPosition === seatPositionWith3Clubs);
  }

  private async setCurrentPlayer(this: DocumentType<PresidentsGame>, player: Ref<PresidentsPlayer>) {
    this.currentPlayer = player;
    await this.save();
    return this;
  }

  public calculateSkips(this: DocumentType<PresidentsGame>, cardsPlayed: Card[]) {
    // first hand of the game there will be no handToBeat
    if (this.turnToBeat === null) {
      return 0;
    }
    // assume cards are valid and cards are better
    const handToBeatCardRankValue = this.turnToBeat[0].cardRank.value;
    const cardRankValue = cardsPlayed[0].cardRank.value;
    if (handToBeatCardRankValue === cardRankValue) {
      if (this.turnToBeat.cardsPlayed.length === cardsPlayed.length) {
        return 1;
      } else {
        let result = 1 + cardsPlayed.length - this.turnToBeat.cardsPlayed.length;
        return result;
      }
    }
    return 0;
  }

  public static async AddPresidentsTurn(this: ReturnModelType<typeof PresidentsGame>, id: string, turn: PresidentsTurnInput) {
    let game = await this.findById(id);
    const validTurn = await game.isValidTurn(turn);
    if (validTurn) {
      const { wasPassed } = turn;
      const forPlayer = await PresidentsPlayerModel.findById(turn.forPlayer);
      const cardsPlayed = await CardModel.findManyByIds(turn.cardsPlayed);
      const presidentsTurn = {
        forPlayer,
        cardsPlayed: turn.cardsPlayed,
        wasPassed,
        endedRound: false,
        wasSkipped: false,
        didCauseSkips: false,
        skipsRemaining: 0,
      };
      presidentsTurn.skipsRemaining = game.calculateSkips(cardsPlayed);
      presidentsTurn.didCauseSkips = presidentsTurn.skipsRemaining > 0;

      const presidentsTurnInstance = await PresidentsTurnModel.createInstance(presidentsTurn);
      const currentRoundIndex = game.rounds.length - 1;
      game.rounds[currentRoundIndex].turns.push(presidentsTurnInstance);

      // add turn to round
      // get fresh game doc with currentPlayer
      if (presidentsTurn.didCauseSkips) {
        while (presidentsTurn.skipsRemaining) {
          presidentsTurn.skipsRemaining--;
          const skipTurn = {
            forPlayer: game.currentPlayer as Ref<PresidentsPlayer>,
            cardsPlayed: [],
            wasPassed: false,
            endedRound: false,
            wasSkipped: true,
            didCauseSkips: false,
            skipsRemaining: presidentsTurn.skipsRemaining,
          };
          const presidentsTurnInstance = await PresidentsTurnModel.createInstance(skipTurn);
          game.rounds[currentRoundIndex].turns.push(presidentsTurnInstance);

        }
      }

      if (game.status.value === GameStatusText.InProgress) {
        let didCurrentPlayersLastTurnEndTheRound = game.didCurrentPlayersLastTurnEndTheRound();
        if (didCurrentPlayersLastTurnEndTheRound) {
          await game.initializeNextRound();
        }
      }

      let instance = await game.save();
      return instance;
    }
  }

  

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
          return Promise.reject(new PresidentsGameError(`Cannot process an invalid turn. Your cards are not better than the last hand.`));
        }
      }
    }
  }

  public async areCardsValid(this: DocumentType<PresidentsGame>, cardsPlayed: Card[]) {
    const currentHandCardRankValues = cardsPlayed.map((card) => card.cardRank.value);
    const rankValue = currentHandCardRankValues[0];
    const areCardsValid = currentHandCardRankValues.every((cardRankValue) => cardRankValue === rankValue);
    return areCardsValid;
  }

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
    }
    else { 
      return Promise.reject(new PresidentsGameError(`The rank of the selected cards does not beat the previous turns.`));
    }
  }

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

    if (turn.cardsPlayed.find(card => card.cardRank.value === 2)) {
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

  public async getNextPlayer(this: DocumentType<PresidentsGame>) {
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

    return nextPlayer;
  }

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

  public static async SendDrinkRequest(this: ReturnModelType<typeof PresidentsGame>, input: SendDrinkRequestInput) {
    let game = await this.findById(input.id);
    const fromPlayerInstance = await PresidentsPlayerModel.findById(input.fromPlayer);
    const toPlayerInstance = await PresidentsPlayerModel.findById(input.toPlayer);

    // TODO -- validate()
    if (
      !fromPlayerInstance.politicalRank ||
      !toPlayerInstance.politicalRank
    ) {
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
      game: game._id
    });

    await fromPlayerInstance.addDrinkRequestSent(requestInstance);
    await toPlayerInstance.addDrinkRequestReceived(requestInstance);
    await game.addDrinkRequest(requestInstance);
  }

  public async addDrinkRequest(this: DocumentType<PresidentsGame>, request: DocumentType<DrinkRequest>) {
    this.drinkRequests.push(request);
    return await this.save();
  }
}