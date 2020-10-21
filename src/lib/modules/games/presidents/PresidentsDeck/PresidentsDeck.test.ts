import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { CardModel, CardRankModel, DeckModel, GameConfigurationModel, GameStatusModel, SecurityDomainModel, SuitModel, UserModel } from '../../../core';

import { GameStatusText } from './../../../../types';
import { PresidentsDeckModel } from '.';
import { PresidentsGameModel } from '..';
import { Types } from 'mongoose';
import { Utils } from './../../../modules.utils';
import { createCardRanks } from '../../../core/CardRank/CardRank.data';
import { createCards } from '../../../core/Card/Card.data';
import { createGameConfigurations } from '../../../core/GameConfiguration/GameConfiguration.data';
import { createGameStatuses } from '../../../core/GameStatus/GameStatus.data';
import { createPresidentsDeck } from '../PresidentsDeck/PresidentsDeck.data';
import { createSecurityDomains } from '../../../core/SecurityDomain/SecurityDomain.data';
import { createSuits } from '../../../core/Suit/Suit.data';
import { createUsers } from './../../../core/User/User.data';
import db from '../../../../db';
import { logger } from './../../../../logger';

describe('Presidents Deck Model Tests', function() {

  beforeAll(async () => {
    await db.connect();
    await createSuits();
    await createCardRanks();
    await createCards();
  })

  afterAll(async () => {
    await DeckModel.deleteMany({});
    await SuitModel.deleteMany({});
    await CardRankModel.deleteMany({});
    await CardModel.deleteMany({});
    await db.disconnect();
  })

  describe('@createStandardDeck()', function() {

    it('should initialize 1 instances', async function() {    
      await createPresidentsDeck();
      const instance = await PresidentsDeckModel.findOne({name: 'Standard Presidents Deck'});
      expect(instance.cards.length).toBe(52);
      expect(instance.cards[0].cardRank.value).toBeGreaterThanOrEqual(2);
      expect(instance.cards[0].suit.value).toBeGreaterThanOrEqual(0);
    });

  });

});
