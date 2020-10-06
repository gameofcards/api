import * as autopopulate from 'mongoose-autopopulate';

import { Card, Deck } from '../../../core';
import { CreateDeckInput, InstanceId } from '../../../../types';
import { Field, ObjectType } from 'type-graphql';
import { modelOptions as ModelOptions, plugin as Plugin, Ref, ReturnModelType } from '@typegoose/typegoose';

import { DeckInterface } from '../../../core/Deck/Deck';
import Instance from '../../../core/Instance';
import { Utils } from '../../../modules.utils';

/**
 * This class represents a PresidentsDeck.
 * @extends Instance
 * @public
 * 
 */
@ModelOptions(Utils.getDisciminatorModelOptions())
@Plugin(autopopulate)
@ObjectType({ implements: [Instance, DeckInterface] })
export default class PresidentsDeck extends Deck {
  public _id!: InstanceId;
  public name!: string;
  public cards!: Ref<Card>[];

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
   * 
   */
  public static async createInstance(this: ReturnModelType<typeof PresidentsDeck>, input: CreateDeckInput) {
    return this.create(input);
  }
}
