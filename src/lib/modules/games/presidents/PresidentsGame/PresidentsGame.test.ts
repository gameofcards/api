import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { GameConfigurationModel, UserModel } from '../../../core';

import { GameStatusText } from '../../../../types';
import { PresidentsGameModel } from '..';
import { Types } from 'mongoose';

export const PresidentsGameTests = () => test.skip('CreateGameAndAddPlayer', async () => {
  const id = Types.ObjectId();
  const createdByUser = await UserModel.createInstance({
    username: id,
    email: id,
    displayName: id,
    password: id,
  });
  const config = await GameConfigurationModel.findOne({ name: 'Presidents' });
  const gameInput = {
    name: id,
    config,
    createdByUser,
  };

  const instance = await PresidentsGameModel.createInstance(gameInput);

  test.skip('createInstance', async () => {
    expect(instance).toBeDefined();
    expect(instance.name).toEqual(id);
    expect(instance.config.name).toEqual(config.name);
    expect(instance.status.value).toEqual(GameStatusText.NotStarted);
    expect(instance.deck.name).toEqual('Standard Presidents Deck');
    expect(instance.turnToBeat).toBeFalsy();
    expect(instance.currentPlayer).toBeFalsy();
    expect(instance.winningPlayer).toBeFalsy();
    expect(instance.rounds).toBeFalsy();
    expect(instance.players).toBeFalsy();
    expect(instance.drinkRequests).toBeFalsy();
  });

  test('addPlayerFromUserId', async () => {
    const user = await UserModel.findById(createdByUser._id);
    expect(user.playerRecords.length).toEqual(1);
    expect(instance.players.length).toEqual(1);
  });
});

describe.skip('id generator 1', () => {
  const id = Types.ObjectId();
  expect(id).toEqual(id);
  console.log(id);

  describe('id generator 2', () => {
    const id = Types.ObjectId();
    expect(id).toEqual(id);
    console.log(id);

    test('id generator 3', () => {
      const id = Types.ObjectId();
      expect(id).toEqual(id);
      console.log(id);
    });
  });
});
