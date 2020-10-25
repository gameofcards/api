import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import {
  CardModel,
  CardRankModel,
  DeckModel,
  GameConfigurationModel,
  GameStatusModel,
  SuitModel,
  UserModel,
} from '../../../core';

import { DomainModel } from '../../../security/Domain';
import { PermissionModel } from '../../../security/Permission';
import { PoliticalRankModel } from '../PoliticalRank';
import { PresidentsGameModel } from '..';
import { PresidentsPlayerModel } from '.';
import { RoleModel } from '../../../core/Role';
import { SecurityGroupModel } from '../../../security/SecurityGroup';
import { SecurityPolicyModel } from '../../../security/SecurityPolicy';
import { StatusValues } from './../../../../types';
import { Types } from 'mongoose';
import { UITaskModel } from '../../../security/UITask';
import { createCardRanks } from '../../../core/CardRank/CardRank.data';
import { createCards } from '../../../core/Card/Card.data';
import { createGameConfigurations } from '../../../core/GameConfiguration/GameConfiguration.data';
import { createGameDataDomain } from './../../../security/Domain/Domain.data';
import { createGameStatuses } from '../../../core/GameStatus/GameStatus.data';
import { createPermissions } from './../../../security/Permission/Permission.data';
import { createPoliticalRanks } from '../PoliticalRank/PoliticalRank.data';
import { createPresidentsDeck } from '../PresidentsDeck/PresidentsDeck.data';
import { createRoles } from './../../../core/Role/Role.data';
import { createSecurityGroups } from './../../../security/SecurityGroup/SecurityGroup.data';
import { createStandardDeck } from '../../../core/Deck/Deck.data';
import { createStatuses } from './../../../core/Status/Status.data';
import { createSuits } from '../../../core/Suit/Suit.data';
import { createUITasks } from './../../../security/UITask/UITask.data';
import { createUsers } from './../../../core/User/User.data';
import db from '../../../../db';

describe('Presidents Player', function () {
  beforeAll(async () => {
    await db.connect();
    await createSuits();
    await createCardRanks();
    await createCards();
    await createStatuses();
    await createRoles();
    await createUsers();
    await createUITasks();
    await createGameDataDomain()
    await createSecurityGroups();
    await createPermissions();
  });

  afterAll(async () => {
    await CardModel.deleteMany({});
    await CardRankModel.deleteMany({});
    await SuitModel.deleteMany({});
    await PresidentsPlayerModel.deleteMany({});
    
    await UserModel.deleteMany({});
    await RoleModel.deleteMany({});

    await UITaskModel.deleteMany({});
    await DomainModel.deleteMany({});
    await SecurityGroupModel.deleteMany({});
    await PermissionModel.deleteMany({});
    await SecurityPolicyModel.deleteMany({});

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

  test.skip('#setCards', async () => {
    // const id = Types.ObjectId();
    // const user = await UserModel.findOne({username: 'tommypastrami'});
    // const player = {
    //   user: user._id,
    //   game: id,
    //   seatPosition: 0
    // };
    // const instance = await PresidentsPlayerModel.createInstance(player);
    // expect(instance.drinksDrunk).toEqual(0);
    // let result = await instance.drinkDrink();
    // expect(result).toBeDefined();
    // expect(result.drinksDrunk).toEqual(1);
  });

  test.skip('#addDrinkRequestSent', async () => {});

  test.skip('#addDrinkRequestReceived', async () => {});
});
