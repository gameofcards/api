import { Field, ID, InputType } from 'type-graphql';

import { Ref } from '@typegoose/typegoose';
import { SecurityGroup } from '../SecurityGroup';
import { Status } from '../../core';
import { UITask } from '../UITask';

@InputType()
export class CreatePermissionInput {
  @Field()
  name: string;

  @Field((type) => ID)
  securityGroup: Ref<SecurityGroup>;

  @Field((type) => Status)
  status: Status;

  @Field((type) => ID)
  task: Ref<UITask>;
}
