import { prop as Property, defaultClasses, ReturnModelType, modelOptions as ModelOptions } from '@typegoose/typegoose';
import { InterfaceType, Field } from 'type-graphql';
import ClassBase from '../ClassBase';
import { InstanceId } from '../../../types';

@ModelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    discriminatorKey: 'type',
  },
})
@InterfaceType({ implements: ClassBase })
export default class Status {
  public _id!: InstanceId;

  @Property({ required: true, unique: true, uppercase: true })
  @Field()
  public value!: string;

  public static async findByValue(this: ReturnModelType<typeof Status>, value: string) {
    return this.findOne({ value });
  }
}
