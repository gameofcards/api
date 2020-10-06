import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { CardModel } from '../Card';
import { CardRankModel } from '../CardRank';
import { DeckModel } from '../Deck';
import { GameConfigurationModel } from '.';
import { SuitModel } from '../Suit';
import { createCardRanks } from '../CardRank/CardRank.data';
import { createCards } from '../Card/Card.data';
import { createGameConfigurations } from './GameConfiguration.data';
import { createPresidentsDeck } from '../../games/presidents/PresidentsDeck/PresidentsDeck.data';
import { createStandardDeck } from '../Deck/Deck.data';
import { createSuits } from '../Suit/Suit.data';
import db from '../../../db';

export const GameConfigurationTests = () => {

  describe('Game Configuration Model Tests', function() {

    beforeAll(async () => {
      await db.connect();
      await createSuits();
      await createCardRanks();
      await createCards();
      await createStandardDeck();
      await createPresidentsDeck();
    })

    afterAll(async () => {
      await DeckModel.deleteMany({});
      await SuitModel.deleteMany({});
      await CardRankModel.deleteMany({});
      await CardModel.deleteMany({});
      await GameConfigurationModel.deleteMany({});
      await db.disconnect();
    })


    describe('@createGameConfigurations()', function() {

      it('should initialize 2 instances', async function() {    
        await createGameConfigurations();
        const instances = await GameConfigurationModel.find({});
        expect(instances.length).toBe(2);
      });

    })


    describe('validations', function() {    

      it('name is required', async function() {
        const standardDeck = await DeckModel.findOne({ name: 'Standard Deck' });
        const config = {
          maxPlayers: 1,
          minPlayers: 1,
          deck: standardDeck,
          numDecks: 1
        };
        try {
          const instance = await GameConfigurationModel.createInstance(config);
        } catch (err) {
          expect(err.message).toEqual('GameConfiguration validation failed: name: Path `name` is required.')
        }
      });
  
      it('name must be unique', async function() {
        const standardDeck = await DeckModel.findOne({ name: 'Standard Deck' });
        const config = {
          name: 'Presidents',
          maxPlayers: 1,
          minPlayers: 1,
          deck: standardDeck,
          numDecks: 1
        };
        try {
          const instance = await GameConfigurationModel.createInstance(config);
        } catch (err) {
          expect(err.message).toContain('duplicate key error');
        }
      });
  
      it('maxPlayers is required', async function() {    
        const standardDeck = await DeckModel.findOne({ name: 'Standard Deck' });
        const config = {
          name: 'name',
          minPlayers: 1,
          deck: standardDeck,
          numDecks: 1
        };
        try {
          const instance = await GameConfigurationModel.createInstance(config);
        } catch (err) {
          expect(err.message).toContain('GameConfiguration validation failed: maxPlayers: Path `maxPlayers` is required.')
        }
      });

      it('maxPlayers must be >= minPlayers', async function() {    
        const standardDeck = await DeckModel.findOne({ name: 'Standard Deck' });
        const config = {
          name: 'maxplayersgame',
          deck: standardDeck,
          numDecks: 1,
          maxPlayers: 0,
          minPlayers: 1
        };
        try {
          const instance = await GameConfigurationModel.createInstance(config);
        } catch (err) {
          expect(err.message).toContain('A value for maxPlayers must be greater than or equal to minPlayers.')
        }
      });

      it('minPlayers must be <= maxPlayers', async function() {    
        const standardDeck = await DeckModel.findOne({ name: 'Standard Deck' });
        const config = {
          name: 'name',
          deck: standardDeck,
          numDecks: 1,
          maxPlayers: 1,
          minPlayers: 2
        };
        try {
          const instance = await GameConfigurationModel.createInstance(config);
        } catch (err) {
          expect(err.message).toContain('A value for minPlayers must be less than or equal to maxPlayers.')
        }
      });

      it('deck is required', async function() {  
        const standardDeck = await DeckModel.findOne({ name: 'Standard Deck' }); 
        const config = {
          name: 'name',
          numDecks: 1,
          maxPlayers: 2,
          minPlayers: 1
        };
        try {
          const instance = await GameConfigurationModel.createInstance(config);
        } catch (err) {
          expect(err.message).toEqual('GameConfiguration validation failed: deck: Path `deck` is required.')
        }
      });
  
      it('numDecks is required', async function() {  
        const standardDeck = await DeckModel.findOne({ name: 'Standard Deck' }); 
        const config = {
          name: 'name',
          maxPlayers: 1,
          minPlayers: 1,
          deck: standardDeck
        };
        try {
          const instance = await GameConfigurationModel.createInstance(config);
        } catch (err) {
          expect(err.message).toEqual('GameConfiguration validation failed: numDecks: Path `numDecks` is required.')
        }
      });
      
    });

})};