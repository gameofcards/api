import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { dropCoreModule, initializeCoreModule } from './../../../core/core.data';

import { PresidentsPlayerModel } from '../PresidentsPlayer';
import { PresidentsRoundModel } from '..';
import { Types } from 'mongoose';
import db from '../../../../db';
import { logger } from '../../../../logger';

describe('Presidents Round', function () {
  beforeAll(async () => {
    logger.info('[BEGIN] Presidents Round Tests');
    await db.connect();
    await initializeCoreModule();
  });

  afterAll(async () => {
    await dropCoreModule();
    await PresidentsPlayerModel.deleteMany({});
    await db.disconnect();
    logger.info('[END] Presidents Round Tests');
  });

  test('#createInstance', async () => {
    const id = Types.ObjectId();
    const round = { number: 0, game: id };
    const instance = await PresidentsRoundModel.createInstance(round);

    expect(instance).toBeDefined();
    expect(instance._id).toBeDefined();
    expect(instance.id).toBeDefined();
    expect(instance.number).toEqual(0);
    expect(instance.startedAt).toBeDefined();
    expect(instance.turns).toBeDefined();
    expect(instance.turns.length).toEqual(0);
  });
});
