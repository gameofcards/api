import { prop as Property, Ref, ReturnModelType, modelOptions as ModelOptions, plugin as Plugin } from '@typegoose/typegoose';
import { ObjectType, Field, InterfaceType } from 'type-graphql';
import * as autopopulate from 'mongoose-autopopulate';
import Card from '../Card/Card';
import ClassBase from '../ClassBase';
import { InstanceId } from '../../../types';

@InterfaceType({ implements: ClassBase })
export class DeckInterface {
  public _id!: InstanceId;

  @Property({ required: true, unique: true })
  @Field()
  public name!: string;

  @Property({ autopopulate: true, ref: 'Card' })
  @Field((type) => [Card])
  public cards!: Ref<Card>[];
}

@ModelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    discriminatorKey: 'type',
  },
})
@Plugin(autopopulate)
@ObjectType({ implements: [ClassBase, DeckInterface] })
export default class Deck extends DeckInterface {
  public _id!: InstanceId;
  public name!: string;
  public cards!: Ref<Card>[];

  public get displayId() {
    return `${this.name}`;
  }

  public static async getByName(this: ReturnModelType<typeof Card>, name: string) {
    return this.find({ name });
  }
}
