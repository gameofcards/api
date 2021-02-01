import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { AddPresidentsTurnInput, AddPresidentsTurnRequest } from './../PresidentsTurn/PresidentsTurn.input';
import { CardModel, GameStatusModel, UserModel } from '../../../core';
import { FulfillDrinkRequestRequest, SendDrinkRequestRequest } from './../DrinkRequest/DrinkRequest.input';
import { PoliticalRankValues, StatusValues } from './../../../../types';
import { dropCoreModule, initializeCoreModule } from './../../../core/core.data';

import { PoliticalRankModel } from '../PoliticalRank';
import { PresidentsGameBuilder } from './PresidentsGame.builder';
import { PresidentsGameModel } from '..';
import { Utils } from './../../../modules.utils';
import { createPoliticalRanks } from '../PoliticalRank/PoliticalRank.data';
import db from '../../../../db';
import { dropPoliticalRanks } from './../PoliticalRank/PoliticalRank.data';
import { logger } from './../../../../logger';

describe('Presidents Game', function () {
  beforeAll(async () => {
    logger.info('[BEGIN] Presidents Game Tests');
    await db.connect();
    await initializeCoreModule();
    await createPoliticalRanks();
  });

  afterAll(async () => {
    await dropCoreModule();
    await dropPoliticalRanks();
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
    });
  });

  describe('#addPlayer', function () {
    it('should create a player and add it to the game', async () => {
      const id = Utils.getObjectId();
      const user = await UserModel.findOne({ username: 'tommypastrami' });
      const gameInput = {
        name: `${id}`,
        createdByUser: user.id,
      };
      const instance = await PresidentsGameModel.createInstance(gameInput);
      const result = await instance.addPlayer(user.id);

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
        takeFirstTurn: true,
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
      const [A, B] = await PresidentsGameBuilder.getTestCardHands();
    });
  });

  describe('#AddPresidentsTurn', function () {
    it('should throw an error on an invalid turn', async () => {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: false,
      });
      
      const forPlayer = game.players.find((player) => !Utils.areIDsEqual(player._id, game.currentPlayer));
      const invalidTurn: AddPresidentsTurnRequest = {
        id: game.id,
        forPlayer: forPlayer.id,
        cardsPlayed: [forPlayer.cards[0].id],
        wasPassed: false
      }
      try {
        await PresidentsGameModel.AddPresidentsTurn(invalidTurn);
      } catch (err) {
        expect(err.message).toEqual('Unable to process turn. It is not your turn.');
      }

    });
    
    it('should update fields on the game and remove cards from the player', async () => {
      let game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: false,
      });
      let forPlayer = game.players.find((player) => Utils.areIDsEqual(player._id, game.currentPlayer));
      const turn: AddPresidentsTurnRequest = {
        id: game.id,
        forPlayer: forPlayer.id,
        cardsPlayed: [forPlayer.cards.find(card => card.shortHand === '3Clubs').id],
        wasPassed: false
      }
      const numberOfCardsBefore = forPlayer.cards.length;
      game = await PresidentsGameModel.AddPresidentsTurn(turn);
      // one turn added
      expect(game.rounds[0].turns.length).toEqual(1);
      // turn was for current player 
      expect(Utils.areIDsEqual(game.turnToBeat.forPlayer, turn.forPlayer)).toBeTruthy();
      // expect a diff current player now
      expect(Utils.areIDsEqual(game.currentPlayer, forPlayer._id)).toBeFalsy();
      // get player who took the turn
      forPlayer = game.players.find((player) => Utils.areIDsEqual(player._id, forPlayer._id));
      // they should have one less card
      expect(numberOfCardsBefore - forPlayer.cards.length).toEqual(1);
    });

    it("should add a skip turn and end the round", async () => {
      let game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: false,
      });
      let forPlayer = game.players.find((player) => Utils.areIDsEqual(player._id, game.currentPlayer));
      let turn: AddPresidentsTurnRequest = {
        id: game.id,
        forPlayer: forPlayer.id,
        cardsPlayed: [forPlayer.cards.find(card => card.shortHand === '3Clubs').id],
        wasPassed: false
      };
      game = await PresidentsGameModel.AddPresidentsTurn(turn);
      forPlayer = game.players.find((player) => Utils.areIDsEqual(player._id, game.currentPlayer));
      turn = {
        id: game.id,
        forPlayer: forPlayer.id,
        cardsPlayed: [forPlayer.cards.find(card => card.cardRank.value === 3).id],
        wasPassed: false
      };
      game = await PresidentsGameModel.AddPresidentsTurn(turn);
      // 3 Clubs, a 3, and a skip turn
      expect(game.rounds[0].turns.length).toEqual(3);
      // expect same current player
      expect(Utils.areIDsEqual(forPlayer._id, game.currentPlayer)).toBeTruthy();
      // expect last turn of first round to be a skip
      expect(game.rounds[0].turns[2].wasSkipped).toBeTruthy();
      // expect the 2nd turn to be marked as a round ender
      expect(game.rounds[0].turns[1].endedRound).toBeTruthy();
      // expect the next round to be added
      expect(game.rounds.length).toEqual(2);
      // expect turn to beat to be null
      expect(game.turnToBeat).toBeFalsy();
    });
  });

  describe('#isRoundOver', function () {
    it('true - they twoed it and booted it', async function () {
      let game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: false,
      });
      let forPlayer = game.players.find((player) => Utils.areIDsEqual(player._id, game.currentPlayer));
      let turn: AddPresidentsTurnRequest = {
        id: game.id,
        forPlayer: forPlayer.id,
        cardsPlayed: [forPlayer.cards.find(card => card.shortHand === '3Clubs').id],
        wasPassed: false
      };
      game = await PresidentsGameModel.AddPresidentsTurn(turn);
      forPlayer = game.players.find((player) => Utils.areIDsEqual(player._id, game.currentPlayer));
      turn = {
        id: game.id,
        forPlayer: forPlayer.id,
        cardsPlayed: [forPlayer.cards.find(card => card.cardRank.value === 2).id],
        wasPassed: false
      };
      game = await PresidentsGameModel.AddPresidentsTurn(turn);
      // expect round 1 to have 2 turns
      expect(game.rounds[0].turns.length).toEqual(2);
      // expect the 2nd turn in round 1 to be marked as round ender
      expect(game.rounds[0].turns[1].endedRound).toBeTruthy();
    });

    it('true - everyone after them skipped or passed', async function () {
      // verified in #AddPresidentsTurn "should add a skip turn and end the round"
    });

    it('false - not all players have taken a turn', async function () {
      let game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: false,
      });
      let forPlayer = game.players.find((player) => Utils.areIDsEqual(player._id, game.currentPlayer));
      let turn: AddPresidentsTurnRequest = {
        id: game.id,
        forPlayer: forPlayer.id,
        cardsPlayed: [forPlayer.cards.find(card => card.shortHand === '3Clubs').id],
        wasPassed: false
      };
      game = await PresidentsGameModel.AddPresidentsTurn(turn);
      const result = game.isRoundOver();
      expect(result.isRoundOver).toBeFalsy();
    });

    it.skip("false - they haven't played a turn in this round yet", async function () {
    });

    it.skip('false - they got skipped', async function () {});

    it.skip('false - they passed', async function () {});

    it.skip('false - someone after them played a better hand of cards', async function () {});
  });

  describe('#getNextPlayer', function () {
    it('when called 8 times it wraps around the players array', async function () {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella', 'tommypastrami', 'johnnyroastbeef', 'tony', 'malory', 'bobby', 'timmy'],
      });
      const startingPlayer = game.currentPlayer;
      let next;
      await Utils.asyncForEach([1, 2, 3, 4, 5, 6, 7, 8], async () => {
        next = await game.getNextPlayerId();
        game.currentPlayer = next;
      });
      expect(startingPlayer).toEqual(next);
    });
  });

  describe('#Rematch', function () {
    
    it('starts a game and assigns political ranks', async function () {
      let game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: false,
      });
      const president = await PoliticalRankModel.findOne({ name: PoliticalRankValues.President });
      const asshole = await PoliticalRankModel.findOne({ name: PoliticalRankValues.Asshole });
      game.findPlayerBySeatPosition(0).nextGameRank = president;
      game.findPlayerBySeatPosition(1).nextGameRank = asshole;
      await game.save();    
      const rematch = await PresidentsGameModel.Rematch(game.id);
      expect(rematch).toBeDefined();
      expect(rematch.players.length).toEqual(2);
      expect(rematch.findPlayerBySeatPosition(0).politicalRank.name).toEqual(PoliticalRankValues.President);
      expect(rematch.findPlayerBySeatPosition(1).politicalRank.name).toEqual(PoliticalRankValues.Asshole);
      expect(rematch.status.value).toEqual(StatusValues.InProgress);
    });

  });


  describe('#SendDrinkRequest', function () {

    it('should throw an error if players do not yet have ranks', async function () {
      let game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: false,
      });
      const request: SendDrinkRequestRequest = {
        fromPlayer: game.players[0].id,
        toPlayer: game.players[1].id,
        id: game.id
      };
      try {
        await PresidentsGameModel.SendDrinkRequest(request);
      } catch (err) {
        expect(err.message).toEqual('you must wait til all players have ranks to give drinks out');
      }
    });

    it('should throw an error if giver does not out rank receiver', async function () {
      let game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: false,
      });
      const president = await PoliticalRankModel.findOne({ name: PoliticalRankValues.President });
      const asshole = await PoliticalRankModel.findOne({ name: PoliticalRankValues.Asshole });
      game.findPlayerBySeatPosition(0).politicalRank = president;
      game.findPlayerBySeatPosition(1).politicalRank = asshole;
      await game.save();  
      const request: SendDrinkRequestRequest = {
        fromPlayer: game.findPlayerBySeatPosition(0).id,
        toPlayer: game.findPlayerBySeatPosition(1).id,
        id: game.id
      };
      try {
        await PresidentsGameModel.SendDrinkRequest(request);
      } catch (err) {
        expect(err.message).toEqual('fromPlayer must out rank toPlayer in order to give a drink');
      }  
    });

    it('should update both player fields if successfull', async function () {
      let game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: false,
      });
      const president = await PoliticalRankModel.findOne({ name: PoliticalRankValues.President });
      const asshole = await PoliticalRankModel.findOne({ name: PoliticalRankValues.Asshole });
      game.findPlayerBySeatPosition(0).politicalRank = president;
      game.findPlayerBySeatPosition(1).politicalRank = asshole;
      await game.save();  
      const request: SendDrinkRequestRequest = {
        fromPlayer: game.findPlayerBySeatPosition(0).id,
        toPlayer: game.findPlayerBySeatPosition(1).id,
        id: game.id
      };
      let result = await PresidentsGameModel.SendDrinkRequest(request);
      expect(result.findPlayerBySeatPosition(0).drinkRequestsSent.length).toEqual(1);
      expect(result.findPlayerBySeatPosition(1).drinkRequestsReceived.length).toEqual(1);
    });

    it('should throw an error if receiver has an unfulfilled drink from giver', async function () {
      let game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: false,
      });
      const president = await PoliticalRankModel.findOne({ name: PoliticalRankValues.President });
      const asshole = await PoliticalRankModel.findOne({ name: PoliticalRankValues.Asshole });
      game.findPlayerBySeatPosition(0).politicalRank = president;
      game.findPlayerBySeatPosition(1).politicalRank = asshole;
      await game.save();  
      const request: SendDrinkRequestRequest = {
        fromPlayer: game.findPlayerBySeatPosition(0).id,
        toPlayer: game.findPlayerBySeatPosition(1).id,
        id: game.id
      };
      let result = await PresidentsGameModel.SendDrinkRequest(request);
      try {
        let result2 = await PresidentsGameModel.SendDrinkRequest(request);
      } catch (err) {
        expect(err.message).toEqual('toPlayer already has a drink to drink from fromPlayer. you can\'t give another')
      }
    });
    
  });

  describe('#FulfillDrinkRequest', function () {

    it('should update both player fields if successful', async function () {
      let game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: false,
      });
      const president = await PoliticalRankModel.findOne({ name: PoliticalRankValues.President });
      const asshole = await PoliticalRankModel.findOne({ name: PoliticalRankValues.Asshole });
      game.findPlayerBySeatPosition(0).politicalRank = president;
      game.findPlayerBySeatPosition(1).politicalRank = asshole;
      await game.save();  
      const request: SendDrinkRequestRequest = {
        fromPlayer: game.findPlayerBySeatPosition(0).id,
        toPlayer: game.findPlayerBySeatPosition(1).id,
        id: game.id
      };
      game = await PresidentsGameModel.SendDrinkRequest(request);
      const fulfillmentRequest: FulfillDrinkRequestRequest = {
        forPlayer: game.findPlayerBySeatPosition(1).id,
        drinkId: game.findPlayerBySeatPosition(1).drinkRequestsReceived[0].id,
        id: game.id
      };
      game = await PresidentsGameModel.FulfillDrinkRequest(fulfillmentRequest);
      logger.info(game.findPlayerBySeatPosition(1).drinkRequestsReceived[0])
      logger.info(game.findPlayerBySeatPosition(0).drinkRequestsSent[0])
      expect(game.findPlayerBySeatPosition(1).drinkRequestsReceived[0].fulfilled).toBeTruthy();
      expect(game.findPlayerBySeatPosition(1).drinkRequestsReceived[0].fulfilledAt).toBeTruthy();
      expect(game.findPlayerBySeatPosition(0).drinkRequestsSent[0].fulfilled).toBeTruthy();
      expect(game.findPlayerBySeatPosition(0).drinkRequestsSent[0].fulfilledAt).toBeTruthy();
    });

  });


});
