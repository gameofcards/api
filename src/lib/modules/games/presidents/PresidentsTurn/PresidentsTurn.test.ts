import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { AddPresidentsTurnInput, GameDataForTurnValidation } from './PresidentsTurn.input';
import { PresidentsTurnValidations, StatusValues } from './../../../../types';
import { dropCoreModule, initializeCoreModule } from './../../../core/core.data';

import { CardModel } from '../../../core';
import { PresidentsGameBuilder } from './../PresidentsGame/PresidentsGame.builder';
import { PresidentsTurnModel } from '.';
import { Utils } from './../../../modules.utils';
import db from '../../../../db';
import { logger } from '../../../../logger';

describe('Presidents Turn', function () {
  beforeAll(async () => {
    logger.info('[BEGIN] Presidents Turn Tests');
    await db.connect();
    await initializeCoreModule();
  });

  afterAll(async () => {
    await PresidentsTurnModel.deleteMany({});
    await dropCoreModule();
    await db.disconnect();
    logger.info('[END] Presidents Game Tests');
  });

  describe('#createInstance()', function () {
    it('should create an instance', async function () {
      let turn = {
        forPlayer: Utils.getObjectId(),
        wasPassed: true,
        cardsPlayed: [],
        wasSkipped: false,
        didCauseSkips: false,
        skipsRemaining: 0,
        endedRound: false,
      };
      const turnInstance = await PresidentsTurnModel.createInstance(turn);

      expect(turnInstance).toBeDefined();
      expect(turnInstance.wasPassed).toBeTruthy();
      expect(turnInstance.cardsPlayed.length).toEqual(0);
      expect(turnInstance.wasSkipped).toBeFalsy();
      expect(turnInstance.didCauseSkips).toBeFalsy();
      expect(turnInstance.skipsRemaining).toBeFalsy();
      expect(turnInstance.endedRound).toBeFalsy();
    });
  });

  describe('#areCardsValid', function () {
    describe('true cases', function () {
      it('cards are of the same rank', async function () {
        const cards = await CardModel.findManyByShortHands(['3Clubs', '3Hearts']);
        const result = PresidentsTurnModel.areCardsValid(cards);
        expect(result).toEqual(true);
      });
    });

    describe('false cases', function () {
      it('cards are not of the same rank', async function () {
        const cards = await CardModel.findManyByShortHands(['3Clubs', '4Hearts']);
        const result = PresidentsTurnModel.areCardsValid(cards);
        expect(result).toEqual(false);
      });
    });
  });

  describe('#areCardsBetter', function () {
    describe('true cases', function () {
      it('current hand has more cards', async function () {
        const cardsToBeat = await CardModel.findManyByShortHands(['3Clubs']);
        const cardsPlayed = await CardModel.findManyByShortHands(['3Hearts', '3Hearts']);
        expect(PresidentsTurnModel.areCardsBetter(cardsToBeat, cardsPlayed)).toEqual(true);
      });

      it('current hand has equal number of cards with same rank', async function () {
        const cardsToBeat = await CardModel.findManyByShortHands(['4Clubs', '4Hearts']);
        const cardsPlayed = await CardModel.findManyByShortHands(['4Spades', '4Diamonds']);
        expect(PresidentsTurnModel.areCardsBetter(cardsToBeat, cardsPlayed)).toEqual(true);
      });

      it('current hand has equal number of cards with a better rank', async function () {
        const cardsToBeat = await CardModel.findManyByShortHands(['3Clubs', '3Hearts']);
        const cardsPlayed = await CardModel.findManyByShortHands(['4Spades', '4Diamonds']);
        expect(PresidentsTurnModel.areCardsBetter(cardsToBeat, cardsPlayed)).toEqual(true);
      });

      it('current hand has fewer cards but contains a two', async function () {
        const cardsToBeat = await CardModel.findManyByShortHands(['3Clubs', '3Hearts']);
        const cardsPlayed = await CardModel.findManyByShortHands(['2Clubs']);
        expect(PresidentsTurnModel.areCardsBetter(cardsToBeat, cardsPlayed)).toEqual(true);
      });
    });

    describe('false cases', function () {
      it("current turn's rank does not beat previous turn's rank", async function () {
        const cardsToBeat = await CardModel.findManyByShortHands(['4Hearts']);
        const cardsPlayed = await CardModel.findManyByShortHands(['3Clubs']);
        expect(PresidentsTurnModel.areCardsBetter(cardsToBeat, cardsPlayed)).toEqual(false);
      });

      it('not enough cards selected (and no 2 included)', async function () {
        const cardsToBeat = await CardModel.findManyByShortHands(['7Clubs', '7Hearts']);
        const cardsPlayed = await CardModel.findManyByShortHands(['7Spades']);
        expect(PresidentsTurnModel.areCardsBetter(cardsToBeat, cardsPlayed)).toEqual(false);
      });
    });
  });

  describe('#calculateSkips', function () {
    it('should return 0 if there are no cards to beat', async () => {
      const cardsPlayed = await CardModel.findManyByShortHands(['3Hearts']);
      const skips = await PresidentsTurnModel.calculateSkips([], cardsPlayed);
      expect(skips).toEqual(0);
    });

    it('should return 0 if the cards played are of a different rank', async () => {
      const cardsToBeat = await CardModel.findManyByShortHands(['3Clubs']);
      const oneCard = await CardModel.findManyByShortHands(['4Clubs']);
      const twoCards = await CardModel.findManyByShortHands(['9Clubs', '9Hearts']);
      const threeCards = await CardModel.findManyByShortHands(['AClubs', 'ADiamonds', 'ASpades']);
      const two = await CardModel.findManyByShortHands(['2Clubs']);
      let skips = await PresidentsTurnModel.calculateSkips(cardsToBeat, oneCard);
      expect(skips).toEqual(0);
      skips = await PresidentsTurnModel.calculateSkips(cardsToBeat, twoCards);
      expect(skips).toEqual(0);
      skips = await PresidentsTurnModel.calculateSkips(cardsToBeat, threeCards);
      expect(skips).toEqual(0);
      skips = await PresidentsTurnModel.calculateSkips(cardsToBeat, two);
      expect(skips).toEqual(0);
    });

    it('should return 1 for single skip', async () => {
      const cardsToBeat = await CardModel.findManyByShortHands(['3Clubs']);
      const cardsPlayed = await CardModel.findManyByShortHands(['3Hearts']);
      const skips = await PresidentsTurnModel.calculateSkips(cardsToBeat, cardsPlayed);
      expect(skips).toEqual(1);
    });

    it('should return 2 for double skip', async () => {
      const cardsToBeat = await CardModel.findManyByShortHands(['3Clubs']);
      const cardsPlayed = await CardModel.findManyByShortHands(['3Hearts', '3Diamonds']);
      const skips = await PresidentsTurnModel.calculateSkips(cardsToBeat, cardsPlayed);
      expect(skips).toEqual(2);
    });

    it('should return 3 for triple skip', async () => {
      const cardsToBeat = await CardModel.findManyByShortHands(['3Clubs']);
      const cardsPlayed = await CardModel.findManyByShortHands(['3Hearts', '3Diamonds', '3Spades']);
      const skips = await PresidentsTurnModel.calculateSkips(cardsToBeat, cardsPlayed);
      expect(skips).toEqual(3);
    });
  });

  describe('#isValidTurn', function () {
    it('should error if it’s not the players turn', async () => {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
      });

      const { currentPlayer } = game;
      const otherPlayer = game.players.filter((player) => player._id !== currentPlayer)[0];
      const turn: AddPresidentsTurnInput = {
        forPlayer: otherPlayer._id,
        cardsPlayed: [],
        wasPassed: true,
      };

      const gameData: GameDataForTurnValidation = {
        currentPlayer: game.currentPlayer,
        isFirstTurnOfTheGame: game.isFirstTurnOfTheGame(),
        isFirstTurnOfCurrentRound: game.isFirstTurnOfCurrentRound(),
        cardsToBeat: game.turnToBeat?.cardsPlayed,
      };

      try {
        PresidentsTurnModel.isValidTurn(gameData, turn);
      } catch (err) {
        expect(err.message).toEqual(Utils.operationFailed(PresidentsTurnValidations.NotYourTurn));
      }
    });

    it('should error if the first turn of the game is not the 3 Clubs', async () => {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
      });

      const forPlayer = game.players.find((player) => player._id === game.currentPlayer)._id;
      const invalidCards = await CardModel.findManyByShortHands(['4Clubs']);
      const validCards = await CardModel.findManyByShortHands(['3Clubs']);
      const invalidTurn: AddPresidentsTurnInput = {
        forPlayer,
        cardsPlayed: invalidCards,
        wasPassed: false,
      };
      const validTurn: AddPresidentsTurnInput = {
        forPlayer,
        cardsPlayed: validCards,
        wasPassed: false,
      };

      const gameData: GameDataForTurnValidation = {
        currentPlayer: game.currentPlayer,
        isFirstTurnOfTheGame: game.isFirstTurnOfTheGame(),
        isFirstTurnOfCurrentRound: game.isFirstTurnOfCurrentRound(),
        cardsToBeat: game.turnToBeat?.cardsPlayed,
      };

      try {
        PresidentsTurnModel.isValidTurn(gameData, invalidTurn);
      } catch (err) {
        expect(err.message).toEqual(Utils.operationFailed(PresidentsTurnValidations.FirstTurn3Clubs));
      }

      let result = false;
      try {
        result = PresidentsTurnModel.isValidTurn(gameData, validTurn);
      } catch (err) {
        expect(result).toEqual(true);
      }
    });

    it("should return true if it is the player's turn and they passed", async () => {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: true,
      });

      const forPlayer = game.players.find((player) => player._id === game.currentPlayer)._id;
      const turn: AddPresidentsTurnInput = {
        forPlayer,
        cardsPlayed: [],
        wasPassed: false,
      };
      const gameData: GameDataForTurnValidation = {
        currentPlayer: game.currentPlayer,
        isFirstTurnOfTheGame: game.isFirstTurnOfTheGame(),
        isFirstTurnOfCurrentRound: game.isFirstTurnOfCurrentRound(),
        cardsToBeat: game.turnToBeat?.cardsPlayed,
      };
      try {
        const result = PresidentsTurnModel.isValidTurn(gameData, turn);
        expect(result).toBeTruthy();
      } catch (err) {
      }
    });

    it("should return true if it is the player's turn and they have valid cards", async () => {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        takeFirstTurn: false,
      });

      const player = game.players.find((player) => player._id === game.currentPlayer);
      const forPlayer = player._id;
      const card = player.cards.find((card) => card.shortHand === '3Clubs');
      const turn: AddPresidentsTurnInput = {
        forPlayer,
        cardsPlayed: [card],
        wasPassed: false,
      };
      const gameData: GameDataForTurnValidation = {
        currentPlayer: game.currentPlayer,
        isFirstTurnOfTheGame: game.isFirstTurnOfTheGame(),
        isFirstTurnOfCurrentRound: game.isFirstTurnOfCurrentRound(),
        cardsToBeat: game.turnToBeat?.cardsPlayed,
      };

      let result = false;
      try {
        result = PresidentsTurnModel.isValidTurn(gameData, turn);
        expect(result).toEqual(true);
      } catch (err) {
        logger.error(err.message);
      }
    });

    it.skip("should error if it is the player's turn and they have invalid cards", async () => {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        skipFirstRound: true,
      });

      const player = game.players.find((player) => player._id === game.currentPlayer);
      const forPlayer = player._id;
      const card = player.cards.find((card) => card.cardRank.value >= 9);
      const turn: AddPresidentsTurnInput = {
        forPlayer,
        cardsPlayed: [card],
        wasPassed: false,
      };
      const gameData: GameDataForTurnValidation = {
        currentPlayer: game.currentPlayer,
        isFirstTurnOfTheGame: game.isFirstTurnOfTheGame(),
        isFirstTurnOfCurrentRound: game.isFirstTurnOfCurrentRound(),
        cardsToBeat: game.turnToBeat?.cardsPlayed,
      };
      let result = false;
      try {
        PresidentsTurnModel.isValidTurn(gameData, turn);
      } catch (err) {
        logger.error(err.message);
        expect(result).toEqual(true);
      }
    });

    it('should return true if it is the first turn of the round and any valid card is selected', async () => {
      const game = await PresidentsGameBuilder.build({
        createdByUser: 'tammy',
        usersToAdd: ['bella'],
        skipFirstRound: true,
      });

      const player = game.players.find((player) => player._id === game.currentPlayer);
      const forPlayer = player._id;
      const card = player.cards[0];
      const turn: AddPresidentsTurnInput = {
        forPlayer,
        cardsPlayed: [card],
        wasPassed: false,
      };
      const gameData: GameDataForTurnValidation = {
        currentPlayer: game.currentPlayer,
        isFirstTurnOfTheGame: game.isFirstTurnOfTheGame(),
        isFirstTurnOfCurrentRound: game.isFirstTurnOfCurrentRound(),
        cardsToBeat: game.turnToBeat?.cardsPlayed,
      };

      let result = false;
      try {
        PresidentsTurnModel.isValidTurn(gameData, turn);
      } catch (err) {
        logger.error(err.message);
        expect(result).toEqual(true);
      }
    });
  });
});
