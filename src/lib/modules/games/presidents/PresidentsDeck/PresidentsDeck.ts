import { Card, Deck } from '../../../core';
import { DocumentType, modelOptions as ModelOptions, plugin as Plugin, Ref, ReturnModelType } from '@typegoose/typegoose';
import { Field, ObjectType } from 'type-graphql';

import { CreateDeckInput } from './../../../core/Deck/Deck.input';
import { DeckInterface } from '../../../core/Deck/Deck';
import {Instance} from '../../../core';
import { InstanceId } from '../../../../types';
import { Utils } from '../../../modules.utils';

/**
 * This class represents a PresidentsDeck.
 * @extends Instance
 * @public
 *
 */
@ModelOptions(Utils.getDisciminatorModelOptions())
@ObjectType({ implements: [Instance, DeckInterface] })
export default class PresidentsDeck extends Deck implements Instance {
  public _id!: InstanceId;
  public id!: string;
  public name!: string;
  public cards!: Card[];

  public get displayId() {
    return `PresidentsDeck - name: ${this.name}`;
  }

  /**
   * This method will create a PresidentsDeck instance.
   * @param input Required parameters to create a PresidentsDeck.
   * @returns Promise<PresidentsDeck>
   * @public
   * @static
   * @async
   * @automation Deck.test.ts #createPresidentsDeck
   */
  public static async createInstance(this: ReturnModelType<typeof PresidentsDeck>, input: CreateDeckInput) {
    return this.create(input);
  }

  /**
   * Utility method to find the index of the stack with the 3 Clubs.
   * @returns Card[]
   * @public
   * @async
   * @automation PresidentsDeck.test.ts #find3ClubsIndex
   */
  public find3ClubsIndex(this: DocumentType<PresidentsDeck>, shuffledStacks: Card[][]) {
    return Utils.find3Clubs(shuffledStacks);
  }
}
