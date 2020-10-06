import { defaultClasses, prop as Property, plugin as Plugin } from '@typegoose/typegoose';
import { InterfaceType, Field, ID } from 'type-graphql';
import { ObjectId } from 'mongoose';

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

  abstract get displayId() 
}
