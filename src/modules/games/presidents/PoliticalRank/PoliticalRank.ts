import { prop as Property, defaultClasses, ReturnModelType, modelOptions as ModelOptions, plugin as Plugin } from '@typegoose/typegoose';
import { ObjectType, Field, Int } from 'type-graphql';
import { InstanceId } from '../../../../types';
import ClassBase from '../../../core/ClassBase';

@ModelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
@ObjectType({implements: ClassBase})
export default class PoliticalRank {
  
  public _id!: InstanceId
  
  @Property({ required: true, unique: true })
  @Field()
  public name!: string
   
  @Property({ required: true, unique: true })
  @Field(type => Int)
  public value!: number

  public static async findByName(this: ReturnModelType<typeof PoliticalRank>, name: string) {
    return this.findOne({name});
  }

  public static async findByValue(this: ReturnModelType<typeof PoliticalRank>, value: string) {
    return this.findOne({value});
  }

  public static async getRanks(this: ReturnModelType<typeof PoliticalRank>, howMany: number) {
    return this.find({value: { $gt: 0 , $lt: howMany + 1 } });
  }
}