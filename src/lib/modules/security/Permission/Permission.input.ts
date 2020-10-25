import { Field, ID, InputType } from 'type-graphql';

import { Ref } from '@typegoose/typegoose';
import { SecurityGroup } from '../SecurityGroup';
import { Status } from '../../core';
import { UITask } from '../UITask';

@InputType()
export class CreatePermissionInput {
  @Field()
  name: string;

  @Field(t=>ID)
  securityGroup: Ref<SecurityGroup>;

  @Field(t=>Status)
  status: Status;

  @Field(t=>ID)
  task: Ref<UITask>;

}