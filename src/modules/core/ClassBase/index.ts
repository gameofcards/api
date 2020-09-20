import { defaultClasses, prop as Property, plugin as Plugin } from '@typegoose/typegoose';
import { InterfaceType, Field, Int } from 'type-graphql';
import { ObjectId } from 'mongodb';

@InterfaceType()
export default class ClassBase extends defaultClasses.Base {
  @Property()
  @Field((type) => ObjectId)
  public _id!: ObjectId;
}
