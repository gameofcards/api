import { logger } from './../../../logger';
import { ObjectId } from 'mongodb';
import { ObjectIdScalar } from './../../../types';
import { ReturnModelType, getModelForClass, getName } from '@typegoose/typegoose';
import {
  Query,
  Arg,
  Int,
  Resolver,
  ArgsType,
  Field,
  Args,
  FieldResolver,
  Root,
  ClassType,
} from "type-graphql";

interface Instance {
  id: string
}
export function InstanceResolver<InstanceType extends Instance> (
  SchemaType: ClassType<InstanceType>,
  Model: ReturnModelType<ClassType<InstanceType>>
) {
  // logger.info(SchemaType)
  // logger.info(Model)

  // `isAbstract` decorator option is mandatory to prevent multiple registering in schema
  @Resolver(of => SchemaType, { isAbstract: true })
  abstract class InstanceResolverClass {
    protected model: ReturnModelType<ClassType<InstanceType>>;
    public modelName: string;

    constructor() {
      this.model = Model;
      this.modelName = getName(SchemaType).toLowerCase();
      logger.info(this.model)
    }

    @Query(returns => SchemaType, { name: `${this.modelName}` })
    protected async getOne(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
      return this.model.findById(id);
    }

    @Query(returns => [SchemaType], { name: `${this.modelName}s` })
    protected async getAll() {
      const all = this.model.find({});
      return all;
    }
  }

  return InstanceResolverClass;
}