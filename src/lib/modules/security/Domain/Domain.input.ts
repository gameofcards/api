import { Field, InputType } from 'type-graphql';

import { Ref } from '@typegoose/typegoose';
import { Status } from '../../core';
import { UITask } from '../UITask';

@InputType()
export class CreateDomainInput {
  @Field()
  name: string;

  @Field((type) => Status)
  status: Status;

  @Field((type) => [UITask])
  tasks?: Ref<UITask>[];
}
