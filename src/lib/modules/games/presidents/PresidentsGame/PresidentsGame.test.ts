import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { CardModel, CardRankModel, DeckModel, GameConfigurationModel, GameStatusModel, SecurityDomainModel, SuitModel, UserModel } from '../../../core';

import { GameStatusText } from './../../../../types';
import { PresidentsGameModel } from '..';
import { Types } from 'mongoose';
import { Utils } from './../../../modules.utils';
import { createCardRanks } from '../../../core/CardRank/CardRank.data';
import { createCards } from '../../../core/Card/Card.data';
import { createGameConfigurations } from '../../../core/GameConfiguration/GameConfiguration.data';
import { createGameStatuses } from '../../../core/GameStatus/GameStatus.data';
import { createPresidentsDeck } from '../PresidentsDeck/PresidentsDeck.data';
import { createSecurityDomains } from '../../../core/SecurityDomain/SecurityDomain.data';
import { createStandardDeck } from './../../../core/Deck/Deck.data';
import { createSuits } from '../../../core/Suit/Suit.data';
import { createUsers } from './../../../core/User/User.data';
import db from '../../../../db';
import { logger } from './../../../../logger';

describe('Presidents Game', function() {

  beforeAll(async () => {
    await db.connect();
    await createSuits();
    await createCardRanks();
    await createCards();
    await createStandardDeck();
    await createPresidentsDeck();
    await createGameConfigurations();
    await createGameStatuses();
    await createSecurityDomains();
    await createUsers();
  })

  afterAll(async () => {
    await CardModel.deleteMany({});
    await CardRankModel.deleteMany({});
    await SuitModel.deleteMany({});
    await DeckModel.deleteMany({});
    await GameConfigurationModel.deleteMany({});
    await GameStatusModel.deleteMany({});
    await SecurityDomainModel.deleteMany({});
    await UserModel.deleteMany({});
    await db.disconnect();
  })

  test('#createInstance', async () => {
    const id = Utils.getObjectId();


    const gameInput = {
      name: `${id}`,
      createdByUser: id
    };

    const instance = await PresidentsGameModel.createInstance(gameInput);

    expect(instance).toBeDefined();
    expect(instance._id).toBeDefined();
    expect(instance.id).toBeDefined();
    expect(instance.name).toEqual(gameInput.name);
    expect(instance.createdAt).toBeDefined();
    expect(instance.startedAt).toBeFalsy();
    expect(instance.finishedAt).toBeFalsy();
    expect(instance.status.value).toEqual(GameStatusText.NotStarted);
    expect(instance.config.name).toEqual('Presidents');
    expect(instance.createdByUser).toEqual(gameInput.createdByUser);
    expect(instance.currentPlayer).toBeFalsy();
    expect(instance.winningPlayer).toBeFalsy();
    expect(instance.turnToBeat).toBeFalsy();
    expect(instance.rounds.length).toEqual(0);
    expect(instance.players.length).toEqual(0);
    expect(instance.drinkRequests.length).toEqual(0);
  });

  test('#addPlayerFromUserId', async () => {
    const user = await UserModel.findOne({ username: 'tommypastrami' });
    const id = Utils.getObjectId();


    const gameInput = {
      name: `${id}`,
      createdByUser: user._id
    };

    const instance = await PresidentsGameModel.createInstance(gameInput);
    const result = await instance.addPlayerFromUserId(user._id);
    expect(result.players.length).toEqual(1);
    expect(result.players[0].user.toString()).toEqual(user.id);
  });

  test('#CreateGameAndAddPlayer', async () => {
    const user = await UserModel.findOne({ username: 'tommypastrami' });
    const id = Utils.getObjectId();


    const gameInput = {
      name: `${id}`,
      createdByUser: user._id
    };

    const instance = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
    expect(instance.players.length).toEqual(1);
    expect(instance.players[0].user.toString()).toEqual(user.id);
  });

  describe('#initialize', async () => {
    const user = await UserModel.findOne({ username: 'tommypastrami' });
    const id = Utils.getObjectId();
    const gameInput = {
      name: `${id}`,
      createdByUser: user._id
    };
    const instance = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
    const result = await instance.initialize();  

    it('should have dealt cards to all players', async () => {
    });

    it('should have set the current player', function() {
      expect(result.currentPlayer).toBeDefined();
    });

    it('should have 3Clubs in current player instance', function() {
    });

    it('should error if the number of players is not at the minimum', async () => {
      const id = Utils.getObjectId();
      const gameInput = {
        name: `${id}`,
        createdByUser: user._id
      };
      const instance = await PresidentsGameModel.CreateGameAndAddPlayer(gameInput);
      try {
        const result = await instance.initialize();  
      } catch (err) {
        expect(err.message).toEqual('Unable to start game. Minimum number of players is 2.')
      }
    });

  });

  describe('#initializeNextRound', async () => {
    it('should error if game is finalized', async () => {
    });
    it('should clear the turn to beat if the game is in progress', async () => {
    });
    it('should set the start time if initializing first round', async () => {
    });
    it('should set the status to in progress if initiailizing first round', async () => {
    });
    it('should have one round', async () => {
    });
  });

  describe('#StartGame', async () => {

  });

});
