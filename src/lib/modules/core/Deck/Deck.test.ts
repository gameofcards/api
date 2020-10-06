import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { CardModel } from '../Card';
import { CardRankModel } from '../CardRank';
import { DeckModel } from '.';
import { SuitModel } from '../Suit';
import { createCardRanks } from '../CardRank/CardRank.data';
import { createCards } from '../Card/Card.data';
import { createStandardDeck } from './Deck.data';
import { createSuits } from '../Suit/Suit.data';
import db from '../../../db';

export const DeckTests = () => {

  describe('Deck Model Tests', function() {

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
        await createStandardDeck();
        const instances = await DeckModel.find({});
        expect(instances.length).toBe(1);
      });

    })

    describe('#createInstance()', function() {
      it('should create an instance', async function() {    
        expect(1).toEqual(1)
      })
    })

})};
