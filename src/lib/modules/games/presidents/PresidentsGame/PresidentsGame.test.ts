import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import {
  CardModel,
  CardRankModel,
  DeckModel,
  GameConfigurationModel,
  GameModel,
  GameStatusModel,
  StatusModel,
  SuitModel,
  UserModel,
} from '../../../core';

import { DomainModel } from '../../../security/Domain';
import { PermissionModel } from '../../../security/Permission';
import { PresidentsGameModel } from '..';
import { PresidentsPlayerModel } from '../PresidentsPlayer';
import { RoleModel } from '../../../core/Role';
import { SecurityGroupModel } from '../../../security/SecurityGroup';
import { SecurityPolicyModel } from '../../../security/SecurityPolicy';
import { StatusValues } from './../../../../types';
import { UITaskModel } from '../../../security/UITask';
import { Utils } from './../../../modules.utils';
import { createCardRanks } from '../../../core/CardRank/CardRank.data';
import { createCards } from '../../../core/Card/Card.data';
import { createGameConfigurations } from '../../../core/GameConfiguration/GameConfiguration.data';
import { createGameDataDomain } from './../../../security/Domain/Domain.data';
import { createGameStatuses } from '../../../core/GameStatus/GameStatus.data';
import { createPermissions } from './../../../security/Permission/Permission.data';
import { createPresidentsDeck } from '../PresidentsDeck/PresidentsDeck.data';
import { createRoles } from './../../../core/Role/Role.data';
import { createSecurityGroups } from './../../../security/SecurityGroup/SecurityGroup.data';
import { createStandardDeck } from '../../../core/Deck/Deck.data';
import { createStatuses } from './../../../core/Status/Status.data';
import { createSuits } from '../../../core/Suit/Suit.data';
import { createUITasks } from './../../../security/UITask/UITask.data';
import { createUsers } from './../../../core/User/User.data';
import db from '../../../../db';
import { logger } from './../../../../logger';

describe('Presidents Game', function () {
  beforeAll(async () => {
    await db.connect();
    await createSuits();
    await createCardRanks();
    await createCards();
    await createStandardDeck();
    await createPresidentsDeck();
    await createGameConfigurations();
    await createGameStatuses();
    await createStatuses();
    await createRoles();
    await createUsers();
    await createUITasks();
    await createGameDataDomain()
    await createSecurityGroups();
    await createPermissions();
  });

  afterAll(async () => {
    await CardModel.deleteMany({});
    await CardRankModel.deleteMany({});
    await SuitModel.deleteMany({});
    await DeckModel.deleteMany({});
    await GameConfigurationModel.deleteMany({});
    await PresidentsPlayerModel.deleteMany({});
    await StatusModel.deleteMany({});

    await UserModel.deleteMany({});
    await RoleModel.deleteMany({});

    await UITaskModel.deleteMany({});
    await DomainModel.deleteMany({});
    await SecurityGroupModel.deleteMany({});
    await PermissionModel.deleteMany({});
    await SecurityPolicyModel.deleteMany({});

    await db.disconnect();
  });

  describe('#createInstance', function () {
    it('should initialize properties', async () => {
      const id = Utils.getObjectId();
      const user = await UserModel.findOne({ username: 'tommypastrami' });
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id,
      };
      const instance = await PresidentsGameModel.createInstance(gameInput);

      expect(instance).toBeDefined();
      expect(instance._id).toBeDefined();
      expect(instance.id).toBeDefined();
      expect(instance.name).toEqual(gameInput.name);
      expect(instance.createdAt).toBeDefined();
      expect(instance.startedAt).toBeFalsy();
      expect(instance.finishedAt).toBeFalsy();
      expect(instance.status.value).toEqual(StatusValues.NotStarted);
      expect(instance.config.name).toEqual('Presidents');
      expect(instance.createdByUser).toEqual(gameInput.createdByUser);
      expect(instance.currentPlayer).toBeFalsy();
      expect(instance.winningPlayer).toBeFalsy();
      expect(instance.turnToBeat).toBeFalsy();
      expect(instance.rounds.length).toEqual(0);
      expect(instance.players.length).toEqual(0);
      expect(instance.drinkRequests.length).toEqual(0);
    });
  });

  describe('#addPlayerFromUserId', function () {
    it('should create a player and add it to the game', async () => {
      const id = Utils.getObjectId();
      const user = await UserModel.findOne({ username: 'tommypastrami' });
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id,
      };
      const instance = await PresidentsGameModel.createInstance(gameInput);
      const result = await instance.addPlayerFromUserId(user._id);

      expect(result.players.length).toEqual(1);
      expect(result.players[0].user.toString()).toEqual(user.id);
    });
  });

  describe('#CreateGameAndAddPlayer', function () {
    it('should create a game and add a player to it by user id', async () => {
      const id = Utils.getObjectId();
      const user = await UserModel.findOne({ username: 'tommypastrami' });
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id,
      };
      const instance = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);

      expect(instance.players.length).toEqual(1);
      expect(instance.players[0].user.toString()).toEqual(user.id);
    });
  });

  describe('#JoinGame', function () {
    it('should add a player instance to the game from user id', async function () {
      const id = Utils.getObjectId();
      const user = await UserModel.findOne({ username: 'tommypastrami' });
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id,
      };
      let instance = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const user2 = await UserModel.findOne({ username: 'johnnyroastbeef' });
      const joinInput1 = {
        id: instance._id,
        userId: user2._id,
      };
      instance = await PresidentsGameModel.JoinGame(joinInput1);

      expect(instance.players.length).toEqual(2);

      const user3 = await UserModel.findOne({ username: 'tony' });
      const joinInput2 = {
        id: instance._id,
        userId: user3._id,
      };
      instance = await PresidentsGameModel.JoinGame(joinInput2);

      expect(instance.players.length).toEqual(3);
    });

    it('should throw error if it is in progress', async function () {
      const id = Utils.getObjectId();
      const user = await UserModel.findOne({ username: 'tommypastrami' });
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const user2 = await UserModel.findOne({ username: 'johnnyroastbeef' });
      const joinInput1 = {
        id: game._id,
        userId: user2._id,
      };
      const inProgressStatus = await GameStatusModel.findByValue('IN_PROGRESS');
      try {
        game.status = inProgressStatus;
        await PresidentsGameModel.JoinGame(joinInput1);
      } catch (err) {
        expect(err.message).toEqual('Cannot join game. It`s in progress.');
      }
    });

    it('should throw error if it is finalized', async function () {
      const id = Utils.getObjectId();
      const user = await UserModel.findOne({ username: 'tommypastrami' });
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const user2 = await UserModel.findOne({ username: 'johnnyroastbeef' });
      const joinInput1 = {
        id: game._id,
        userId: user2._id,
      };
      const finalizedStatus = await GameStatusModel.findByValue('FINALIZED');
      try {
        await PresidentsGameModel.JoinGame(joinInput1);
        game.status = finalizedStatus;
      } catch (err) {
        expect(err.message).toEqual('Cannot join game. It`s finished.');
      }
    });

    it('should throw error if it the game is has reached the maximum players', async () => {
      const id = Utils.getObjectId();
      const user = await UserModel.findOne({ username: 'tammy' });
      const user2 = await UserModel.findOne({ username: 'bella' });
      const user3 = await UserModel.findOne({ username: 'tommypastrami' });
      const user4 = await UserModel.findOne({ username: 'tony' });
      const user5 = await UserModel.findOne({ username: 'malory' });
      const user6 = await UserModel.findOne({ username: 'bobby' });
      const user7 = await UserModel.findOne({ username: 'timmy' });
      const user8 = await UserModel.findOne({ username: 'jethro' });
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id,
      };
      try {
        let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
        const joinInputs = [user, user2, user3, user4, user5, user6, user7, user8].map((user) => ({
          id: game._id,
          userId: user._id,
        }));
        for (let input of joinInputs) {
          game = await PresidentsGameModel.JoinGame(input);
        }
      } catch (err) {
        expect(err.message).toEqual('Cannot join game. It is already full.');
      }
    });
  });

  describe('#initialize', function () {
    it('should have dealt cards and set currentPlayer based on 3Clubs', async function () {
      const id = Utils.getObjectId();
      const user = await UserModel.findOne({ username: 'tommypastrami' });
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const user2 = await UserModel.findOne({ username: 'johnnyroastbeef' });
      const joinInput1 = {
        id: game._id,
        userId: user2._id,
      };
      game = await PresidentsGameModel.JoinGame(joinInput1);
      game = await game.initialize();

      expect(game.players[0].cards.length).toBeGreaterThan(0);
      expect(game.players[1].cards.length).toBeGreaterThan(0);
      expect(game.currentPlayer).toBeDefined();

      const currentPlayer = game.players.find((player) => player._id === game.currentPlayer);
      const find3Clubs = currentPlayer.cards.find((card) => card.shortHand === '3Clubs');

      expect(find3Clubs).toBeDefined();
      expect(find3Clubs.shortHand).toEqual('3Clubs');
    });

    it('should error if the number of players is not at the minimum', async () => {
      const id = Utils.getObjectId();
      const user = await UserModel.findOne({ username: 'tony' });
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id,
      };
      const instance = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      try {
        const result = await instance.initialize();
      } catch (err) {
        expect(err.message).toEqual('Unable to start game. Minimum number of players is 2.');
      }
    });
  });

  describe('#initializeNextRound', function () {
    it('should set the start time if initializing first round', async function () {
      const user = await UserModel.findOne({ username: 'tammy' });
      const user2 = await UserModel.findOne({ username: 'bella' });
      const id = Utils.getObjectId();
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const joinInput = {
        id: game._id,
        userId: user2._id,
      };
      game = await PresidentsGameModel.JoinGame(joinInput);
      game = await game.initialize();
      game = await game.initializeNextRound();

      expect(game.startedAt).toBeDefined();
    });

    it('should set the status to in progress if initiailizing first round', async function () {
      const user = await UserModel.findOne({ username: 'tammy' });
      const user2 = await UserModel.findOne({ username: 'bella' });
      const id = Utils.getObjectId();
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const joinInput = {
        id: game._id,
        userId: user2._id,
      };
      game = await PresidentsGameModel.JoinGame(joinInput);
      game = await game.initialize();
      game = await game.initializeNextRound();

      expect(game.status.value).toEqual(StatusValues.InProgress);
    });

    it('should have one round', async function () {
      const user = await UserModel.findOne({ username: 'tammy' });
      const user2 = await UserModel.findOne({ username: 'bella' });
      const id = Utils.getObjectId();
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const joinInput = {
        id: game._id,
        userId: user2._id,
      };
      game = await PresidentsGameModel.JoinGame(joinInput);
      game = await game.initialize();
      game = await game.initializeNextRound();

      expect(game.rounds.length).toEqual(1);
    });

    it('should error if game is finalized', async function () {
      const user = await UserModel.findOne({ username: 'tammy' });
      const user2 = await UserModel.findOne({ username: 'bella' });
      const id = Utils.getObjectId();
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const joinInput = {
        id: game._id,
        userId: user2._id,
      };
      game = await PresidentsGameModel.JoinGame(joinInput);
      game = await game.initialize();
      game.status = await GameStatusModel.findByValue('FINALIZED');
      try {
        game = await game.initializeNextRound();
      } catch (err) {
        expect(err.message).toEqual('Unable to start next round. The game is finalized.');
      }
    });

    it('should clear the turn to beat if the game is in progress', async () => {
      const user = await UserModel.findOne({ username: 'tammy' });
      const user2 = await UserModel.findOne({ username: 'bella' });
      const id = Utils.getObjectId();
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const joinInput = {
        id: game._id,
        userId: user2._id,
      };
      game = await PresidentsGameModel.JoinGame(joinInput);
      game = await game.initialize();
      game = await game.initializeNextRound();
      const turnId = Utils.getObjectId();
      game.turnToBeat = {
        _id: turnId,
        id: `${turnId}`,
        forPlayer: Utils.getObjectId(),
        takenAt: Utils.getDate(),
        cardsPlayed: [],
        wasPassed: true,
        wasSkipped: false,
        didCauseSkips: false,
        skipsRemaining: 0,
        endedRound: false,
        displayId: '',
      };
      game = await game.initializeNextRound();

      expect(game.turnToBeat).toBeUndefined();
    });
  });

  describe('#StartGame', function () {
    it('should call initialize and initializeNextRound', async () => {
      const user = await UserModel.findOne({ username: 'tammy' });
      const user2 = await UserModel.findOne({ username: 'bella' });
      const id = Utils.getObjectId();
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const joinInput = {
        id: game._id,
        userId: user2._id,
      };
      game = await PresidentsGameModel.JoinGame(joinInput);
      game = await PresidentsGameModel.StartGame(game.id);

      expect(game.players[0].cards.length).toBeGreaterThan(0);
      expect(game.players[1].cards.length).toBeGreaterThan(0);
      expect(game.currentPlayer).toBeDefined();
      expect(game.startedAt).toBeDefined();
      expect(game.status.value).toEqual(StatusValues.InProgress);
      expect(game.rounds.length).toEqual(1);

      try {
        await PresidentsGameModel.StartGame(game.id);
      } catch (err) {
        expect(err.message).toEqual('Unable to start game. It is already in progress.');
      }
    });
  });

  describe.skip('#calculateSkips', function () {
    it('should return 0 if there is no turn to beat', async () => {
      const skips = 0;
      expect(skips).toEqual(0);
    });

    it('should return 0 if the new turn to beat has cards of of a different rank', async () => {
      const skips = 0;
      expect(skips).toEqual(0);
    });

    it('should return 1 for single skip', async () => {
      const skips = 0;
      expect(skips).toEqual(1);
    });

    it('should return 2 for double skip', async () => {
      const skips = 0;
      expect(skips).toEqual(1);
    });

    it('should return 3 for triple skip', async () => {
      const skips = 0;
      expect(skips).toEqual(1);
    });

    it('should return 4 for quadruple skip', async () => {
      const skips = 0;
      expect(skips).toEqual(1);
    });
  });

  describe.skip('#AddPresidentsTurn', function () {});

  describe.skip('#isValidTurn', function () {});

  describe.skip('#areCardsValid', function () {
    describe('true cases', function () {
      it('cards are of the same rank', async function () {});
    });

    describe('false cases', function () {
      it('cards are not of the same rank', async function () {});
    });
  });

  describe.skip('#areCardsBetter', function () {
    describe('true cases', function () {
      it('current hand has more cards', async function () {});

      it('current hand has equal number of cards with same rank', async function () {});

      it('current hand has equal number of cards with a better rank', async function () {});

      it('current hand has fewer cards but contains a two', async function () {});
    });

    describe('false cases', function () {
      it("current turn's rank does not beat previous turn's rank", async function () {});

      it('not enough cards selected (and no 2 included)', async function () {});
    });
  });

  describe.skip('#didCurrentPlayersLastTurnEndTheRound', function () {
    it('true', async function () {});

    it('false - they skipped', async function () {});

    it('false - they passed', async function () {});

    it('false - someone played a better hand', async function () {});
  });

  describe.skip('#getNextPlayer', function () {
    it('when called 8 times it wraps around the players array', async function () {});
  });

  describe.skip('#Rematch', function () {});

  describe.skip('#FulfillDrinkRequest', function () {});

  describe.skip('#SendDrinkRequest', function () {});

  describe.skip('#FulfillDrinkRequest', function () {});
});
