import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { dropCoreModule, initializeCoreModule } from './../../../core/core.data';

import { PresidentsPlayerModel } from '.';
import { Types } from 'mongoose';
import { UserModel } from '../../../core';
import db from '../../../../db';

describe('Presidents Player', function () {
  beforeAll(async () => {
    await db.connect();
    await initializeCoreModule();
  });

  afterAll(async () => {
    await dropCoreModule();
    await PresidentsPlayerModel.deleteMany({});
    await db.disconnect();
  });

  test('#createInstance', async () => {
    const id = Types.ObjectId();
    let user = await UserModel.findOne({ username: 'tommypastrami' });
    const player = {
      user: user._id,
      game: id,
      seatPosition: 0,
    };
    const instance = await PresidentsPlayerModel.createInstance(player);

    expect(instance).toBeDefined();
    expect(instance._id).toBeDefined();
    expect(instance.id).toBeDefined();
    expect(instance.gameDisplayId).toBeDefined();
    expect(instance.user).toBeDefined();
    expect(instance.seatPosition).toEqual(0);
    expect(instance.cards).toBeDefined();
    expect(instance.game).toBeDefined();
    expect(instance.drinksDrunk).toBeDefined();
    expect(instance.drinkRequestsReceived).toBeDefined();
    expect(instance.drinkRequestsSent).toBeDefined();

    user = await UserModel.findOne({ username: 'tommypastrami' });
    expect(user.playerRecords.length).toEqual(1);
    expect(user.playerRecords[0]).toEqual(instance._id);
  });

  test('#drinkDrink', async () => {
    const id = Types.ObjectId();
    const user = await UserModel.findOne({ username: 'tommypastrami' });
    const player = {
      user: user._id,
      game: id,
      seatPosition: 0,
    };
    const instance = await PresidentsPlayerModel.createInstance(player);
    expect(instance.drinksDrunk).toEqual(0);
    let result = await instance.drinkDrink();
    expect(result).toBeDefined();
    expect(result.drinksDrunk).toEqual(1);
  });

  test.skip('#setCards', async () => {});

  test.skip('#addDrinkRequestSent', async () => {});

  test.skip('#addDrinkRequestReceived', async () => {});
});
