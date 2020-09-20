import { prop as Property , Ref, ReturnModelType, modelOptions as ModelOptions, plugin as Plugin } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import * as autopopulate from 'mongoose-autopopulate';
import CardRank from '../CardRank/CardRank';
import Suit from '../Suit/Suit';
import { InstanceId } from '../../../types';
import ClassBase from '../ClassBase';

@ModelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
@Plugin(autopopulate)
@ObjectType({implements: ClassBase})
export default class Card {
  
  public _id!: InstanceId

  @Property({ required: true, unique: true })
  @Field()
  public shortHand!: string

  @Property({ autopopulate: true, ref: 'CardRank' })
  @Field(type => CardRank)
  public cardRank!: Ref<CardRank>

  @Property({ autopopulate: true, ref: 'Suit' })
  @Field(type => Suit)
  public suit!: Ref<Suit>

  public get displayId() {
    return this.shortHand;
  }

  public static async findManyByIds(this: ReturnModelType<typeof Card>, ids: string[]) {
    return this.find({ _id :{$in: ids} });
  }
}
