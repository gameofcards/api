import { Ref, modelOptions as ModelOptions, plugin as Plugin } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import * as autopopulate from 'mongoose-autopopulate';
import { Card, Deck } from '../../../core/';
import { DeckInterface } from '../../../core/Deck/Deck';
import { InstanceId } from '../../../../types';
import ClassBase from '../../../core/ClassBase';

@ModelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
@Plugin(autopopulate)
@ObjectType({ implements: [ClassBase, DeckInterface] })
export default class PresidentsDeck extends Deck {
  public _id!: InstanceId;
  public name!: string;
  public cards!: Ref<Card>[];

  public get displayId() {
    return `PresidentsDeck - name: ${this.name}`;
  }
}
