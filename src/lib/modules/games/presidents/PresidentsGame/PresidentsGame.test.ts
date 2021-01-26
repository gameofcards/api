import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { CardModel, GameStatusModel, UserModel } from '../../../core';
import { dropCoreModule, initializeCoreModule } from './../../../core/core.data';

import { AddPresidentsTurnInput } from './../PresidentsTurn/PresidentsTurn.input';
import { PresidentsGameBuilder } from './PresidentsGame.builder';
import { PresidentsGameModel } from '..';
import { StatusValues } from './../../../../types';
import { Utils } from './../../../modules.utils';
import db from '../../../../db';
import { logger } from './../../../../logger';

describe('Presidents Game', function () {
  beforeAll(async () => {
    logger.info('[BEGIN] Presidents Game Tests');
    await db.connect();
    await initializeCoreModule();
  });

  afterAll(async () => {
    await dropCoreModule();
    await PresidentsGameModel.deleteMany({});
    await db.disconnect();
    logger.info('[END] Presidents Game Tests');
  });

  describe('#createInstance', function () {
    it('should initialize properties', async () => {
      const id = Utils.getObjectId();
      const user = await UserModel.findOne({ username: 'tommypastrami' });
      const gameInput = {
        name: `${id}`,
        createdByUser: user.id,
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
      expect(instance.createdByUser.toString()).toEqual(gameInput.createdByUser);
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
        createdByUser: user.id,
      };
      const instance = await PresidentsGameModel.createInstance(gameInput);
      const result = await instance.addPlayerFromUserId(user.id);

      expect(result.players.length).toEqual(1);
      expect(result.players[0].user).toEqual(user._id);
    });
  });

  describe('#CreateGameAndAddPlayer', function () {
    it('should create a game and add a player to it by user id', async () => {
      const id = Utils.getObjectId();
      const user = await UserModel.findOne({ username: 'tommypastrami' });
      const gameInput = {
        name: `${id}`,
        createdByUser: user.id,
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
        createdByUser: user.id,
      };
      let instance = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const user2 = await UserModel.findOne({ username: 'johnnyroastbeef' });
      const joinInput1 = {
        id: instance.id,
        userId: user2.id,
      };
      instance = await PresidentsGameModel.JoinGame(joinInput1);

      expect(instance.players.length).toEqual(2);

      const user3 = await UserModel.findOne({ username: 'tony' });
      const joinInput2 = {
        id: instance.id,
        userId: user3.id,
      };
      instance = await PresidentsGameModel.JoinGame(joinInput2);

      expect(instance.players.length).toEqual(3);
    });

    it('should throw error if it is in progress', async function () {
      const id = Utils.getObjectId();
      const user = await UserModel.findOne({ username: 'tommypastrami' });
      const gameInput = {
        name: `${id}`,
        createdByUser: user.id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const user2 = await UserModel.findOne({ username: 'johnnyroastbeef' });
      const joinInput1 = {
        id: game.id,
        userId: user2.id,
      };
      const inProgressStatus = await GameStatusModel.findByValue(StatusValues.InProgress);
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
        createdByUser: user.id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const user2 = await UserModel.findOne({ username: 'johnnyroastbeef' });
      const joinInput1 = {
        id: game.id,
        userId: user2.id,
      };
      const finalizedStatus = await GameStatusModel.findByValue(StatusValues.Finalized);
      try {
        game.status = finalizedStatus;
        await PresidentsGameModel.JoinGame(joinInput1);
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
        createdByUser: user.id,
      };
      try {
        let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
        const joinInputs = [user, user2, user3, user4, user5, user6, user7, user8].map((user) => ({
          id: game.id,
          userId: user.id,
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
        createdByUser: user.id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const user2 = await UserModel.findOne({ username: 'johnnyroastbeef' });
      const joinInput1 = {
        id: game.id,
        userId: user2.id,
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
        createdByUser: user.id,
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
        createdByUser: user.id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const joinInput = {
        id: game.id,
        userId: user2.id,
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
        createdByUser: user.id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const joinInput = {
        id: game.id,
        userId: user2.id,
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
        createdByUser: user.id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const joinInput = {
        id: game.id,
        userId: user2.id,
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
        createdByUser: user.id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const joinInput = {
        id: game.id,
        userId: user2.id,
      };
      game = await PresidentsGameModel.JoinGame(joinInput);
      game = await game.initialize();
      game.status = await GameStatusModel.findByValue(StatusValues.Finalized);
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
        createdByUser: user.id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const joinInput = {
        id: game.id,
        userId: user2.id,
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

      expect(game.turnToBeat).toBeNull();
    });
  });

  describe('#StartGame', function () {
    it('should call initialize and initializeNextRound', async () => {
      const user = await UserModel.findOne({ username: 'tammy' });
      const user2 = await UserModel.findOne({ username: 'bella' });
      const id = Utils.getObjectId();
      const gameInput = {
        name: `${id}`,
        createdByUser: user.id,
      };
      let game = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      const joinInput = {
        id: game.id,
        userId: user2.id,
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

  describe('#PresidentsGameBuilder', function () {
    it('should start the game, add players, and set the turn to beat', async () => {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: true
      });

      expect(game.players[0].cards.length).toBeGreaterThan(0);
      expect(game.players[1].cards.length).toBeGreaterThan(0);
      expect(game.currentPlayer).toBeDefined();
      expect(game.startedAt).toBeDefined();
      expect(game.status.value).toEqual(StatusValues.InProgress);
      expect(game.rounds.length).toEqual(1);
      expect(game.turnToBeat).toBeDefined();
      expect(game.turnToBeat.cardsPlayed.length).toEqual(1);
    });

    it('verify test cards', async () => {
      const [A, B] = await PresidentsGameBuilder.getTestCardHands()
    });
  });

  describe('#calculateSkips', function () {
    it('should return 0 if there is no turn to beat', async () => {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella']
      });
      const cardsPlayed = await CardModel.findManyByShortHands(['3Clubs']);
      const skips = await game.calculateSkips(cardsPlayed);
      expect(skips).toEqual(0);
    });

    it('should return 0 if the new turn to beat has cards of a different rank', async () => {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: true
      });
      const oneCard = await CardModel.findManyByShortHands(['4Clubs']);
      const twoCards = await CardModel.findManyByShortHands(['9Clubs', '9Hearts']);
      const threeCards = await CardModel.findManyByShortHands(['AClubs', 'ADiamonds', 'ASpades']);
      const two = await CardModel.findManyByShortHands(['2Clubs']);
      let skips = await game.calculateSkips(oneCard);
      expect(skips).toEqual(0);
      skips = await game.calculateSkips(twoCards);
      expect(skips).toEqual(0);
      skips = await game.calculateSkips(threeCards);
      expect(skips).toEqual(0);
      skips = await game.calculateSkips(two);
      expect(skips).toEqual(0);
    });

    it('should return 1 for single skip', async () => {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: true
      });
      const cardsPlayed = await CardModel.findManyByShortHands(['3Hearts']);
      const skips = await game.calculateSkips(cardsPlayed);
      expect(skips).toEqual(1);
    });

    it('should return 2 for double skip', async () => {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: true
      });
      const cardsPlayed = await CardModel.findManyByShortHands(['3Hearts', '3Diamonds']);
      const skips = await game.calculateSkips(cardsPlayed);
      expect(skips).toEqual(2);
    });

    it('should return 3 for triple skip', async () => {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: true
      });
      const cardsPlayed = await CardModel.findManyByShortHands(['3Hearts', '3Diamonds', '3Spades']);
      const skips = await game.calculateSkips(cardsPlayed);
      expect(skips).toEqual(3);
    });
  });

  describe.skip('#AddPresidentsTurn', function () {

   

  });

  describe('#isValidTurn', function () {

    it('should error if it’s not the players turn', async () => {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella']
      });

      const { currentPlayer } = game;
      const otherPlayer = game.players.filter(player => player._id !== currentPlayer)[0];
      const turn: AddPresidentsTurnInput = {
        forPlayer: otherPlayer._id,
        cardsPlayed: [],
        wasPassed: true
      };

      try {
        await game.isValidTurn(turn);
      } catch (err) {
        expect(err.message).toEqual('Unable to process turn. It is not your turn.');
      }
     
    });

    it('should error if the first turn of the game is not the 3 Clubs', async () => {

      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella']
      });

      const forPlayer = (game.players.find(player => player._id === game.currentPlayer))._id;
      const invalidCards = await CardModel.findManyByShortHands(['4Clubs']);
      const validCards = await CardModel.findManyByShortHands(['3Clubs']);
      const invalidTurn: AddPresidentsTurnInput = {
        forPlayer,
        cardsPlayed: invalidCards,
        wasPassed: false
      };
      const validTurn: AddPresidentsTurnInput = {
        forPlayer,
        cardsPlayed: validCards,
        wasPassed: false
      };

      let result = false;
      try {
        result = await game.isValidTurn(invalidTurn);
      } catch (err) {
        expect(err.message).toEqual('First turn of the game must contain a 3 of clubs.');
      }

      result = false;
      try {
        result = await game.isValidTurn(validTurn);
      } catch (err) {
        expect(result).toEqual(true);
      }

    });

    it('should return true if it is the player\'s turn and they passed', async () => {

      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: true
      });

      const forPlayer = (game.players.find(player => player._id === game.currentPlayer))._id;
      const cardsPlayed = await CardModel.findManyByShortHands(['3Clubs']);
      const turn: AddPresidentsTurnInput = {
        forPlayer,
        cardsPlayed,
        wasPassed: false
      };
      let result = false;
      try {
        result = await game.isValidTurn(turn);
      } catch (err) {
        expect(err.message).toEqual('First turn of the game must contain a 3 of clubs.');
      }

    });

    it('should return true if it is the player\'s turn and they have valid cards', async () => {

      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: true
      });

      const player = game.players.find(player => player._id === game.currentPlayer);
      const forPlayer = player._id;
      const betterCard = player.cards.find(card => card.cardRank.value >= 3);
      const turn: AddPresidentsTurnInput = {
        forPlayer,
        cardsPlayed: [betterCard],
        wasPassed: false
      };

      let result = false;
      try {
        result = await game.isValidTurn(turn);
      } catch (err) {
        logger.error(err.message)
        expect(result).toEqual(true);
      }

    });

    it('should error if it is the player\'s turn and they have invalid cards', async () => {

      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        skipFirstRound: true
      });

      const player = game.players.find(player => player._id === game.currentPlayer);
      const forPlayer = player._id;
      const betterCard = player.cards.find(card => card.cardRank.value >= 9);
      const turn: AddPresidentsTurnInput = {
        forPlayer,
        cardsPlayed: [betterCard],
        wasPassed: false
      };
      let result = false;
      try {
        result = await game.isValidTurn(turn);
      } catch (err) {
        logger.error(err.message)
        expect(result).toEqual(true);
      }

    });

    it('should return true if it is the first turn of the round and any valid card is selected', async () => {

      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        skipFirstRound: true
      });

    
      const player = game.players.find(player => player._id === game.currentPlayer);
      const forPlayer = player._id;
      const card = player.cards[0];
      const turn: AddPresidentsTurnInput = {
        forPlayer,
        cardsPlayed: [card],
        wasPassed: false
      };

      let result = false;
      try {
        result = await game.isValidTurn(turn);
      } catch (err) {
        logger.error(err.message)
        expect(result).toEqual(true);
      }

    });

  });

  

  

  describe('#isRoundOver', function () {
    it('true - they twoed it and booted it', async function () {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        skipFirstRound: true
      });
      const player = game.players.find(player => player._id === game.currentPlayer);
      const forPlayer = player._id;
      const two = player.cards.find(card => card.cardRank.value === 2);
      const turn: AddPresidentsTurnInput = {
        forPlayer,
        cardsPlayed: [two],
        wasPassed: false
      };
    });

    it('true - everyone after them skipped or passed', async function () {

    });

    it('false - not all players have taken a turn', async function () {

    });

    it('false - it\'s their first turn of the round', async function () {

    });

    it('false - they got skipped', async function () {

    });

    it('false - they passed', async function () {

    });

    it('false - someone after them played a better hand of cards', async function () {

    });
  });

  describe('#getNextPlayer', function () {
    it('when called 8 times it wraps around the players array', async function () {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella', 'tommypastrami', 'johnnyroastbeef', 'tony', 'malory', 'bobby', 'timmy']
      });
      const startingPlayer = game.currentPlayer;
      let next;
      await Utils.asyncForEach([1,2,3,4,5,6,7,8], async () => {
        next = await game.getNextPlayerId();
        game.currentPlayer = next;
      });
      expect(startingPlayer).toEqual(next);
    });
  });

  describe.skip('#Rematch', function () {

  });

  describe.skip('#FulfillDrinkRequest', function () {

  });

  describe.skip('#SendDrinkRequest', function () {

  });

  describe.skip('#FulfillDrinkRequest', function () {

  });
});
