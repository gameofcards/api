import 'regenerator-runtime/runtime';
import 'reflect-metadata';

import { SuitModel } from '.';
import { createSuits } from './Suit.data';
import db from '../../../db';

describe('Suit Model Tests', function() {

    beforeAll(async () => {
      await db.connect();
    })

    afterAll(async () => {
      await SuitModel.deleteMany({});
      await db.disconnect();
    })

    describe('@createSuits()', function() {

      it('should initialize 4 instances', async function() {    
        await createSuits();
        const instances = await SuitModel.find({});
        expect(instances.length).toBe(4);
      })

    })

    describe('validations', function() {    

      it('name is required', async function() {
        const suit = {
          color: 'Black',
          character: '1234',
          value: 0
        };
        try {
          const instance = await SuitModel.createInstance(suit as any);
        } catch (err) {
          expect(err.message).toEqual('Suit validation failed: name: Path `name` is required.')
        }
      });
  
      it('name must be unique', async function() {
        const suit = {
          name: 'Diamonds',
          color: 'Red',
          character: '\u2666',
          value: 1
        };
        try {
          const instance = await SuitModel.createInstance(suit as any);
        } catch (err) {
          expect(err.message).toContain('duplicate key error');
        }
      });
  
      it('color is required', async function() {    
        const suit = {
          name: 'Clubs',
          character: '1234',
          value: 0
        };
        try {
          const instance = await SuitModel.createInstance(suit as any);
        } catch (err) {
          expect(err.message).toEqual('Suit validation failed: color: Path `color` is required.')
        }
      });
  
      it('character is required', async function() {    
        const suit = {
          name: 'Clubs',
          color: 'Black',
          value: 0
        };
        try {
          const instance = await SuitModel.createInstance(suit as any);
        } catch (err) {
          expect(err.message).toEqual('Suit validation failed: character: Path `character` is required.')
        }
      });
  
      it('character must be unique', async function() {
        const suit = {
          name: 'Diamonds',
          color: 'Red',
          character: '\u2666',
          value: 1
        };
        try {
          const instance = await SuitModel.createInstance(suit);
        } catch (err) {
          expect(err.message).toContain('duplicate key error');
        }
      });
      
      it('value is required', async function() {    
        const suit = {
          name: 'Clubs',
          color: 'Black',
          character: '1234'
        };
        try {
          const instance = await SuitModel.createInstance(suit as any);
        } catch (err) {
          expect(err.message).toEqual('Suit validation failed: value: Path `value` is required.')
        }
      });
  
      it('value must be unique', async function() {
        const suit = {
          name: 'Diamonds',
          color: 'Red',
          character: '\u2666',
          value: 1
        };
        try {
          const instance = await SuitModel.createInstance(suit);
        } catch (err) {
          expect(err.message).toContain('duplicate key error');
        }
      });
  
    });

});