import * as autopopulate from 'mongoose-autopopulate';

import { CreateDeckInput, InstanceId } from '../../../types';
import { DocumentType, modelOptions as ModelOptions, plugin as Plugin, prop as Property, Ref, ReturnModelType } from '@typegoose/typegoose';
import { Field, InterfaceType, ObjectType } from 'type-graphql';

import Card from '../Card/Card';
import Instance from '../Instance';
import { Utils } from '../../modules.utils';

/**
 * This class is an interface we can implement other Deck types with
 * for GraphQL types.
 * @extends Instance
 * @public
 * 
 */
@InterfaceType({ implements: [Instance] })
export class DeckInterface {
  public _id!: InstanceId;

  @Field()
  public name!: string;

  @Field((type) => [Card])
  public cards!: Card[];
}

/**
 * This class represents a standard deck of 52 cards.
 * @extends Instance
 * @public
 * 
 */
@ModelOptions(Utils.getDisciminatorModelOptions())
@ObjectType({ implements: [Instance, DeckInterface] })
export default class Deck implements Instance {
  public _id!: InstanceId;
  public id!: string;

  @Property({ required: true, maxlength: 30 })
  @Field()
  public name!: string;

  @Property({ required: true, type: Card })
  @Field((type) => [Card])
  public cards!: Card[];

  public get displayId() {
    return `${this.name}`;
  }

  /**
   * Utility method to return a Deck by name.
   * @param character The name of the Deck
   * @returns Promise<Deck>
   * @public
   * @static
   * @async
   * @automation Desk.test.ts #createStandardDeck
   */
  public static async createInstance(this: ReturnModelType<typeof Deck>, input: CreateDeckInput) {
    return this.create(input);
  }
  
  /**
   * Utility method to return an array of shuffled cards.
   * @returns Card[]
   * @public
   * @async
   * @automation Desk.test.ts #getShuffledCards
   */
  public getShuffledCards(this: DocumentType<Deck>): Card[] {
    return Utils.shuffle(this.cards);
  }

  /**
   * Utility method to deal an array of shuffled cards.
   * @returns Card[]
   * @public
   * @async
   * @automation Desk.test.ts #deal
   */
  public deal(this: DocumentType<Deck>, numPlayers: number, shuffled: Card[]) {
    return Utils.deal(numPlayers, shuffled);
  }
}
