import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { CardModel, CardRankModel, DeckModel, GameConfigurationModel, GameStatusModel, SecurityDomainModel, SuitModel, UserModel } from '../../../core';

import { PoliticalRankModel } from '../PoliticalRank';
import { PresidentsGameModel } from '..';
import { PresidentsPlayerModel } from '.';
import { Types } from 'mongoose';
import { createCardRanks } from '../../../core/CardRank/CardRank.data';
import { createCards } from '../../../core/Card/Card.data';
import { createGameConfigurations } from '../../../core/GameConfiguration/GameConfiguration.data';
import { createGameStatuses } from '../../../core/GameStatus/GameStatus.data';
import { createPoliticalRanks } from '../PoliticalRank/PoliticalRank.data';
import { createPresidentsDeck } from '../PresidentsDeck/PresidentsDeck.data';
import { createSecurityDomains } from '../../../core/SecurityDomain/SecurityDomain.data';
import { createStandardDeck } from '../../../core/Deck/Deck.data';
import { createSuits } from '../../../core/Suit/Suit.data';
import { createUsers } from './../../../core/User/User.data';
import db from '../../../../db';

describe('Presidents Player', function() {


  beforeAll(async () => {
    await db.connect();
    await createSuits();
    await createCardRanks();
    await createCards();
    await createUsers();
  })

  afterAll(async () => {
    await CardModel.deleteMany({});
    await CardRankModel.deleteMany({});
    await SuitModel.deleteMany({});
    await PresidentsPlayerModel.deleteMany({});
    await UserModel.deleteMany({});
    await db.disconnect();
  })

  test('#createInstance', async () => {
    const id = Types.ObjectId();
    let user = await UserModel.findOne({username: 'tommypastrami'});
    const player = {
      user: user._id,
      game: id,
      seatPosition: 0
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

    user = await UserModel.findOne({username: 'tommypastrami'});
    expect(user.playerRecords.length).toEqual(1);
    expect(user.playerRecords[0]).toEqual(instance._id);
  });

  test('#drinkDrink', async () => {
    const id = Types.ObjectId();
    const user = await UserModel.findOne({username: 'tommypastrami'});
    const player = {
      user: user._id,
      game: id,
      seatPosition: 0
    };
    const instance = await PresidentsPlayerModel.createInstance(player);
    expect(instance.drinksDrunk).toEqual(0);
    let result = await instance.drinkDrink();
    expect(result).toBeDefined();
    expect(result.drinksDrunk).toEqual(1);
  });

});
