import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { dropCoreModule, initializeCoreModule } from './../../../core/core.data';

import { CardModel } from '../../../core';
import { PresidentsGameBuilder } from './../PresidentsGame/PresidentsGame.builder';
import { PresidentsTurnModel } from '.';
import { StatusValues } from './../../../../types';
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
        endedRound: false
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
        const result = PresidentsTurnModel.areCardsValid(cards)
        expect(result).toEqual(true);
      });

    });

    describe('false cases', function () {
      
      it('cards are not of the same rank', async function () {
        const cards = await CardModel.findManyByShortHands(['3Clubs', '4Hearts']);
        const result = PresidentsTurnModel.areCardsValid(cards)
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
});
