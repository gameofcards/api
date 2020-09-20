import { ObjectType } from 'type-graphql';
import Status from '../Status/Status';
import ClassBase from '../ClassBase';
import { modelOptions } from '@typegoose/typegoose';
import { InstanceId } from '../../../types';

@modelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
@ObjectType({implements: [ClassBase, Status]})
export default class GameStatus extends Status {
  public _id!: InstanceId
  public value!: string
}
