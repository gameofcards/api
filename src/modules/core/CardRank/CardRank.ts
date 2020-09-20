import { prop as Property, ReturnModelType, modelOptions as ModelOptions } from '@typegoose/typegoose';
import { ObjectType, Field, Int } from 'type-graphql';
import { InstanceId } from '../../../types';
import ClassBase from '../ClassBase';

@ModelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
@ObjectType({ implements: ClassBase })
export default class CardRank {
  public _id!: InstanceId;

  @Property({ required: true, unique: true })
  @Field()
  public name!: string;

  @Property({ required: true, unique: true })
  @Field()
  public character!: string;

  @Property({ required: true, unique: true })
  @Field((type) => Int)
  public value!: number;

  public static async findByChar(this: ReturnModelType<typeof CardRank>, character: string): Promise<CardRank> {
    return this.findOne({ character });
  }
}
