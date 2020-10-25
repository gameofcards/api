import { DocumentType, Ref } from '@typegoose/typegoose';
import { Field, InputType } from 'type-graphql';

import { Status } from '../../core';
import { UITask } from '../UITask';

@InputType()
export class CreateDomainInput {
  @Field()
  name: string;

  @Field(t=>Status)
  status: Status;

  @Field(t=>[UITask])
  tasks?: Ref<UITask>[];
}