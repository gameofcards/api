import { prop as Property, defaultClasses, modelOptions as ModelOptions, plugin as Plugin } from '@typegoose/typegoose';
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
export default class SecurityDomain {
  public _id!: InstanceId;

  @Property({ required: true })
  @Field()
  public name!: string;

  @Property({ required: true })
  @Field((type) => Int)
  public clearanceLevel!: number;
}
