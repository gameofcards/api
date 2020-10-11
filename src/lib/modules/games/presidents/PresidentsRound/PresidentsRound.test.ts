import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { CardModel, CardRankModel, DeckModel, GameConfigurationModel, GameStatusModel, SecurityDomainModel, SuitModel, UserModel } from '../../../core';

import { PresidentsRoundModel } from '..';
import { Types } from 'mongoose';
import { createCardRanks } from '../../../core/CardRank/CardRank.data';
import { createCards } from '../../../core/Card/Card.data';
import { createGameConfigurations } from '../../../core/GameConfiguration/GameConfiguration.data';
import { createGameStatuses } from '../../../core/GameStatus/GameStatus.data';
import { createPresidentsDeck } from '../PresidentsDeck/PresidentsDeck.data';
import { createSecurityDomains } from '../../../core/SecurityDomain/SecurityDomain.data';
import { createStandardDeck } from '../../../core/Deck/Deck.data';
import { createSuits } from '../../../core/Suit/Suit.data';
import { createUsers } from '../../../core/User/User.data';
import db from '../../../../db';
import { logger } from '../../../../logger';

describe('Presidents Round', function() {


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
    logger.info(JSON.stringify(instance, null, 2))
  });

});
