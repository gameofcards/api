import {
  prop as Property,
  defaultClasses,
  ReturnModelType,
  modelOptions as ModelOptions,
  plugin as Plugin,
} from '@typegoose/typegoose';
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
export default class Suit {
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

  @Property({ required: true })
  @Field()
  public color!: string;

  public static async findByName(this: ReturnModelType<typeof Suit>, name: string) {
    return this.findOne({ name });
  }
}
