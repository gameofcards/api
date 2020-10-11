import { Field, ID, InterfaceType } from 'type-graphql';
import { plugin as Plugin, prop as Property, defaultClasses } from '@typegoose/typegoose';

import { ObjectId } from 'mongodb';

/**
 * This abstract class defines some base fields/methods, and all classes representing
 * documents should extend it. It also generates an interface for GraphQL which all 
 * other GraphQL types should implement.
 * @extends typegoose.defaultClasses.Base
 * @abstract
 * @public
 * 
 */
@InterfaceType()
export default abstract class Instance extends defaultClasses.Base {
  
  @Property()
  @Field((type) => ID)
  public _id!: ObjectId;

  @Property()
  @Field()
  public id!: string;

  abstract get displayId() 
}
