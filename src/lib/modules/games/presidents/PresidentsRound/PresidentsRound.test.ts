import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import {
  CardModel,
  CardRankModel,
  DeckModel,
  GameConfigurationModel,
  StatusModel,
  SuitModel,
  UserModel,
} from '../../../core';

import { DomainModel } from '../../../security/Domain';
import { PermissionModel } from '../../../security/Permission';
import { PresidentsGameModel } from '..';
import { PresidentsPlayerModel } from '../PresidentsPlayer';
import { PresidentsRoundModel } from '..';
import { RoleModel } from '../../../core/Role';
import { SecurityGroupModel } from '../../../security/SecurityGroup';
import { SecurityPolicyModel } from '../../../security/SecurityPolicy';
import { StatusValues } from './../../../../types';
import { Types } from 'mongoose';
import { UITaskModel } from '../../../security/UITask';
import { Utils } from './../../../modules.utils';
import { createCardRanks } from '../../../core/CardRank/CardRank.data';
import { createCards } from '../../../core/Card/Card.data';
import { createGameConfigurations } from '../../../core/GameConfiguration/GameConfiguration.data';
import { createGameDataDomain } from './../../../security/Domain/Domain.data';
import { createGameStatuses } from '../../../core/GameStatus/GameStatus.data';
import { createPermissions } from './../../../security/Permission/Permission.data';
import { createPresidentsDeck } from '../PresidentsDeck/PresidentsDeck.data';
import { createRoles } from './../../../core/Role/Role.data';
import { createSecurityGroups } from './../../../security/SecurityGroup/SecurityGroup.data';
import { createStandardDeck } from '../../../core/Deck/Deck.data';
import { createStatuses } from './../../../core/Status/Status.data';
import { createSuits } from '../../../core/Suit/Suit.data';
import { createUITasks } from './../../../security/UITask/UITask.data';
import { createUsers } from './../../../core/User/User.data';
import db from '../../../../db';
import { logger } from '../../../../logger';

describe('Presidents Round', function () {
  beforeAll(async () => {
    await db.connect();
    await createSuits();
    await createCardRanks();
    await createCards();
    await createStandardDeck();
    await createPresidentsDeck();
    await createGameConfigurations();
    await createGameStatuses();
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
    await DeckModel.deleteMany({});
    await GameConfigurationModel.deleteMany({});
    await PresidentsPlayerModel.deleteMany({});
    await StatusModel.deleteMany({});

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
