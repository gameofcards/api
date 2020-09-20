import {
  prop as Property,
  getName,
  Ref,
  ReturnModelType,
  DocumentType,
  modelOptions as ModelOptions,
  plugin as Plugin,
} from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import * as autopopulate from 'mongoose-autopopulate';
import { Types } from 'mongoose';
import DealerUtils from '../../../../DealerUtils';
import { PresidentsTurnInput, PresidentsGameInput, GameStatus } from '../../../../types';
import {
  DrinkRequestModel,
  PresidentsDeckModel,
  PresidentsPlayerModel,
  PresidentsGameModel,
  PresidentsTurnModel,
  PresidentsRoundModel,
} from '../';
import { DrinkRequest, PresidentsDeck, PresidentsPlayer, PresidentsTurn, PresidentsRound } from '../';
import { GameConfigurationModel, GameStatusModel, UserModel, CardModel } from '../../../core';
import { Card, Game, GameConfiguration, Player, User } from '../../../core';
import { InstanceId } from '../../../../types';
import ClassBase from '../../../core/ClassBase';

@ModelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
@Plugin(autopopulate)
@ObjectType({ implements: [ClassBase, Game] })
export default class PresidentsGame extends Game {
  public _id!: InstanceId;
  public name!: String;
  public createdAt!: Date;
  public startedAt?: Date;
  public finishedAt?: Date;
  public status!: Ref<GameStatus>;
  public config!: Ref<GameConfiguration>;
  public createdByUser!: Ref<User>;
  public currentPlayer?: Ref<Player>;

  @Property({ ref: 'PresidentsPlayer' })
  @Field((type) => PresidentsPlayer)
  public winningPlayer?: Ref<PresidentsPlayer>;

  @Property({ autopopulate: true, ref: 'PresidentsTurn' })
  @Field((type) => PresidentsTurn)
  public turnToBeat!: Ref<PresidentsTurn>;

  @Property({ autopopulate: true, ref: 'PresidentsRound' })
  @Field((type) => [PresidentsRound])
  public rounds!: Ref<PresidentsRound>[];

  @Property({ autopopulate: true, ref: 'PresidentsPlayer' })
  @Field((type) => [PresidentsPlayer])
  public players!: Ref<PresidentsPlayer>[];

  @Property({ autopopulate: true, ref: 'PresidentsDeck', required: true })
  @Field((type) => PresidentsDeck)
  public deck!: Ref<PresidentsDeck>;

  @Property({ ref: 'DrinkRequest', required: true })
  @Field((type) => [DrinkRequest])
  public drinkRequests!: Ref<DrinkRequest>;

  public static async CreateGameAndAddPlayer(this: ReturnModelType<typeof PresidentsGame>, input: PresidentsGameInput) {
    const game = await PresidentsGame.createInstance(input);
    return await game.addPlayerFromUserId(input.createdByUser);
  }

  public static async createInstance(this: ReturnModelType<typeof PresidentsGame>, input: PresidentsGameInput) {
    let { name, config, createdByUser } = input;
    config = await GameConfigurationModel.findById(config);
    createdByUser = await UserModel.findById(createdByUser);
    const status = await GameStatusModel.findByValue(GameStatus.NotStarted);
    const deck = await PresidentsDeckModel.findOne({ name: 'Standard Presidents Deck' });
    const turnToBeat = null;
    const currentPlayer = null;
    const winningPlayer = null;
    const rounds = [];
    const players = [];
    const drinkRequests = [];
    const game = {
      name,
      config,
      createdByUser,
      status,
      turnToBeat,
      rounds,
      players,
      currentPlayer,
      winningPlayer,
      deck,
      drinkRequests,
    };
    const instance = new PresidentsGameModel(game);
    return await instance.save();
  }

  public async addPlayerFromUserId(this: DocumentType<typeof PresidentsGame>, userId: string) {
    const user = await UserModel.findById(userId);
    const player = await PresidentsPlayerModel.createInstance(user);
    return await this.addPlayer(player);
  }

  public async addPlayer(this: DocumentType<typeof PresidentsGame>, player: DocumentType<typeof PresidentsPlayer>) {
    this.players.push(player);
    return await this.save();
  }

  public static async StartGame(this: ReturnModelType<typeof PresidentsGame>, id: string) {
    let game = await PresidentsGameModel.findById(id);
    game = await game.initialize();
    return await game.initializeNextRound();
  }

  public async initialize(this: DocumentType<typeof PresidentsGame>) {
    if (this.status.value === GameStatus.InProgress) {
      return Promise.reject(new Error('Unable to start game. It is already in progress.'));
    }

    if (this.status.value === GameStatus.Finalized) {
      return Promise.reject(new Error('Unable to start game. It has already finished.'));
    }

    if (this.players.length < this.config.minPlayers) {
      return Promise.reject(new Error(`Unable to start game. Minimum number of players is ${this.config.minPlayers}}.`));
    }

    if (this.players.length === this.config.maxPlayers) {
      return Promise.reject(
        new Error(`Unable to start game. The maximum amount of players (${this.config.maxPlayers}) has been reached.`)
      );
    }

    let { deck } = this.config;
    let shuffledDeck = DealerUtils.Shuffle(deck.cards);
    const numPlayers = this.players.length;
    let dealtCards = DealerUtils.Deal(numPlayers, shuffledDeck);
    this.players.forEach((player) => (player.hand = DealerUtils.SortCards(dealtCards[player.seatPosition])));
    const seatPositionWith3Clubs = DealerUtils.Find3Clubs(dealtCards);
    const playerWith3Clubs = this.players.find((player) => player.seatPosition === seatPositionWith3Clubs);
    this.currentPlayer = playerWith3Clubs.user;
    this.drinks = [];

    return this.save();
  }

  public async initializeNextRound(this: DocumentType<typeof PresidentsGame>) {
    if (this.status.value === GameStatus.Finalized) {
      return Promise.reject(new Error('Unable to start next round. The game is finalized.'));
    }
    if (this.status.value === GameStatus.InProgress) {
      if (this.turnToBeat) {
        this.turnToBeat.remove();
      }
    }
    if (this.status.value === GameStatus.NotStarted) {
      this.startedAt = new Date();
      this.status = await GameStatusModel.findOne({ value: GameStatus.InProgress });
    }

    const round = await PresidentsRoundModel.createInstance(this);
    this.rounds.push(round);
    return this.save();
  }

  public static async JoinGame(this: ReturnModelType<typeof PresidentsGame>, id: string, userId: string) {
    const game = await PresidentsGameModel.findById(id);
    return await game.addPlayerFromUserId(userId);
  }

  public static async AddPresidentsTurn(this: ReturnModelType<typeof PresidentsGame>, id: string, turn: PresidentsTurnInput) {
    const game = await PresidentsGameModel.findById(id);
    const validTurn = await game.isValidTurn(turn);
    if (validTurn) {
      const { wasPassed } = turn;
      const forPlayer = await PresidentsPlayerModel.findById(turn.forPlayer);
      const cardsPlayed = await CardModel.findManyByIds(turn.cardsPlayed);
      const presidentsTurn = {
        forPlayer,
        cardsPlayed,
        wasPassed,
        endedRound: false,
        wasSkipped: false,
        didCauseSkips: false,
        skipsRemaining: 0,
      };
      presidentsTurn.skipsRemaining = this.calculateSkips(cardsPlayed);
      presidentsTurn.didCauseSkips = presidentsTurn.skipsRemaining > 0;

      const presidentsTurnInstance = await PresidentsTurnModel.createInstance(presidentsTurn);

      // add turn to round
      // get fresh game doc with currentPlayer
      if (presidentsTurn.didCauseSkips) {
        while (presidentsTurn.skipsRemaining) {
          presidentsTurn.skipsRemaining--;
          const skipTurn = {
            forPlayer: game.currentPlayer,
            cardsPlayed: [],
            wasPassed: false,
            endedRound: false,
            wasSkipped: true,
            didCauseSkips: false,
            skipsRemaining: presidentsTurn.skipsRemaining,
          };
          const presidentsTurnInstance = await PresidentsTurnModel.createInstance(skipTurn);
        }
      }

      if (game.status.value === GameStatus.InProgress) {
        let didCurrentPlayersLastTurnEndTheRound = game.didCurrentPlayersLastTurnEndTheRound();
        if (didCurrentPlayersLastTurnEndTheRound) {
          await game.initializeNextRound();
        }
      }
    }
  }

  public calculateSkips(this: DocumentType<typeof PresidentsGame>, cardsPlayed: ReturnModelType<typeof Card>[]) {
    // first hand of the game there will be no handToBeat
    if (this.turnToBeat === null) {
      return 0;
    }
    // assume cards are valid and cards are better
    const handToBeatCardRankValue = this.turnToBeat[0].cardRank.value;
    const cardRankValue = this.turnToBeat[0].cardRank.value;
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

  public async isValidTurn(this: DocumentType<typeof PresidentsGame>, turn: PresidentsTurnInput) {
    const player = await PresidentsPlayerModel.findById(turn.forPlayer);
    const cardInstances = await CardModel.findManyByIds(turn.cardsPlayed);
    const turnToBeatCards = this.turnToBeat.cardsPlayed || [];
    const isPlayersTurn = player._id === this.currentPlayer._id;
    const isPlayingCards = this.cardsPlayed.length > 0;

    if (!isPlayersTurn) {
      // TODO -- 'Cannot process an invalid turn. It's not your turn.'
    }
    if (isPlayersTurn && turn.wasPassed) {
      // TODO --  'Yes.'
    }
    if (isPlayersTurn && !turn.wasPassed) {
      // Is the current hand valid (all ranks the same)?
      const areCardsValid = await PresidentsGameModel.AreCardsValid(cardInstances);
      if (areCardsValid) {
        // TODO --  'Cannot process an invalid turn. The cards selected are invalid.'
      }
      const isFirstTurnOfTheGame = this.rounds.length === 1 && this.rounds[0].turns.length === 0;
      if (isFirstTurnOfTheGame) {
        const contains3Clubs = cardInstances.find((card) => card.shortHand === '3Clubs');
        if (contains3Clubs) {
        }
      }
      const isFirstTurnOfCurrentRound = this.rounds[this.rounds.length - 1].length === 0;
      if (isFirstTurnOfCurrentRound) {
        // TODO -- no validation, all good
      }
      // it's a turn in the middle of the round, see if it's better than the last
      if (this.turnToBeat === undefined) {
        // TODO -- no turn to beat, all good
      } else {
        const areCardsBetter = await PresidentsGameModel.AreCardsBetter(cardInstances);
        if (areCardsBetter) {
          // TODO -- no problem
        } else {
          // TODO -- 'Cannot process an invalid turn. Your cards are not better than the last hand.'
        }
      }
    }
  }

  public static async areCardsValid(cardsPlayed: ReturnModelType<typeof Card>[]) {
    const currentHandCardRankValues = cardsPlayed.map((card) => card.cardRank.value);
    const rankValue = currentHandCardRankValues[0];
    const areCardsValid = currentHandCardRankValues.every((cardRankValue) => cardRankValue === rankValue);
    return areCardsValid;
  }

  public async areCardsBetter(this: DocumentType<typeof PresidentsGame>, cardsPlayed: DocumentType<typeof Card>[]) {
    const handToBeatCardRankValues = this.turnToBeat.cardsPlayed.map((card) => card.cardRank.value);
    const currentHandCardRankValues = cardsPlayed.map((card) => card.cardRank.value);

    const doesContainTwo = !!currentHandCardRankValues.find((value) => value === 2);
    if (doesContainTwo) {
      // TODO -- no problem
    }

    const doesCurrentHandHaveMoreCards = currentHandCardRankValues.length > handToBeatCardRankValues.length;
    if (doesCurrentHandHaveMoreCards) {
      // TODO -- no problem
    }

    const areNumberOfCardsEqual = currentHandCardRankValues.length === handToBeatCardRankValues.length;
    if (areNumberOfCardsEqual) {
      const areCardsSameRank = currentHandCardRankValues[0] === handToBeatCardRankValues[0];
      if (areCardsSameRank) {
        // TODO -- no problem
      }

      // case2b: current hand's card rank beats previous turns card rank
      const doesCurrentHandRankBeatPrevious = currentHandCardRankValues[0] > handToBeatCardRankValues[0];
      if (doesCurrentHandRankBeatPrevious) {
        // TODO -- no problem
      } else {
        // TODO -- problem
      }
    }
  }

  public async didCurrentPlayersLastTurnEndTheRound(this: DocumentType<typeof PresidentsGame>) {
    let latestRound = this.rounds[this.rounds.length - 1];
    let playersLastTurnIdx;
    let searchingForLastTurn = true;
    let foundLastTurn = false;
    let i = latestRound.turns.length;

    if (i < this.players.length) {
      return false;
    }

    while (searchingForLastTurn) {
      i--;
      let turn = latestRound.turns[i];
      if (this.currentPlayer.equals(turn.forPlayer)) {
        playersLastTurnIdx = i;
        searchingForLastTurn = false;
        foundLastTurn = true;
      }
    }

    // TODO:
    // if it was a two then yes it did, regardless of if all players have played

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
          if (this.currentPlayer.equals(turn.user)) {
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

  public async getNextPlayer(this: DocumentType<typeof PresidentsGame>) {
    const currentPlayer = this.players.find((player) => player.user._id.toString() === this.currentPlayer.toString());
    const currentSeatPosition = currentPlayer.seatPosition;
    let nextSeatPosition = (currentSeatPosition + 1) % this.players.length;
    let searching = true;
    let nextPlayer;

    while (searching) {
      nextPlayer = this.players.find((player) => player.seatPosition === nextSeatPosition);
      if (nextPlayer.toObject().hasOwnProperty('nextGameRank')) {
        nextSeatPosition = (nextSeatPosition + 1) % this.players.length;
      } else {
        searching = false;
      }
    }

    return nextPlayer.user._id;
  }

  public static async Rematch(this: ReturnModelType<typeof PresidentsGame>, id: string) {
    let game = await PresidentsGameModel.findById(id);
    let { createdBy, config } = game;

    let players = game.players.sort((a, b) => (a.seatPosition < b.seatPosition ? 1 : -1));
    let usersToAdd = players.map(({ user, nextGameRank }) => ({ _id: user._id, nextGameRank }));
    let name = `${game.name}-rematch-${Types.ObjectId()}`;
    const gameInput = { name, createdBy, config };

    let newGame = await PresidentsGameModel.createInstance(gameInput);

    Promise.all(usersToAdd.map(async (user) => newGame.addPlayerFromUserId(user._id)));

    newGame = await newGame.initialize();
    return await newGame.initializeNextRound();
  }

  public static async FulfillDrinkRequest(id: string) {
    const drinkRequest = await DrinkRequestModel.findById(id);
    const player = await PresidentsPlayerModel.findById(drinkRequest.toPlayer);
    // TODO -- validate()
    const hasDrinksToDrink = player.drinkRequestsReceived.length - player.drinksDrunk === 0;
    if (hasDrinksToDrink) {
      return Promise.reject(new Error('Unable to drink any drinks. User has none to drink.'));
    }
    // TODO
    await player.drinkDrink();
    return await drinkRequest.fulfill();
  }

  public static async SendDrinkRequest(id: string, fromPlayer: string, toPlayer: string) {
    let game = await PresidentsGameModel.findById(id);
    const fromPlayerInstance = await PresidentsPlayerModel.findById(fromPlayer);
    const toPlayerInstance = await PresidentsPlayerModel.findById(toPlayer);

    // TODO -- validate()
    if (
      !fromPlayerInstance.toObject().hasOwnProperty('politicalRank') ||
      !toPlayerInstance.toObject().hasOwnProperty('politicalRank')
    ) {
      return Promise.reject(new Error('you must wait til all players have ranks to give drinks out'));
    }
    const doesGiverOutRankReceiver = fromPlayerInstance.politicalRank.value < fromPlayerInstance.politicalRank.value;
    if (!doesGiverOutRankReceiver) {
      return Promise.reject(new Error('fromPlayer must out rank toPlayer in order to give a drink'));
    }
    const { drinksDrunk } = toPlayerInstance;
    const doesReceiverHaveDrinksToDrink = toPlayerInstance.drinksReceived.length - drinksDrunk;
    if (doesReceiverHaveDrinksToDrink) {
      let drinksToDrink = toPlayerInstance.drinkRequestsReceived.slice(drinksDrunk);
      // TODO -- update logic for new model
      // const doesReceiverAlreadyHaveADrinkFromGiver = drinksToDrink.find(drink => drink.sentBy.toString() === fromUserInstance._id.toString());
      // if (doesReceiverAlreadyHaveADrinkFromGiver) {
      //   return Promise.reject(new Error('toPlayer already has a drink to drink from fromPlayer. you can\'t give another'));
      // }
    }

    const requestInstance = await DrinkRequestModel.createInstance(fromPlayer, toPlayer, game);

    await fromPlayerInstance.addDrinkRequestSent(requestInstance);
    await toPlayerInstance.addDrinkRequestReceived(requestInstance);
    await game.addDrinkRequest(requestInstance);
  }

  public async addDrinkRequest(this: DocumentType<typeof PresidentsGame>, request: ReturnModelType<typeof DrinkRequest>) {
    this.drinkRequests.push(request);
    return await this.save();
  }
}
