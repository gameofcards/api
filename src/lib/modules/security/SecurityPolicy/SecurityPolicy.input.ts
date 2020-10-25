import { Field, ID, InputType } from 'type-graphql';

import { Domain } from '../Domain';
import { Permission } from '../Permission';
import { Ref } from '@typegoose/typegoose';
import { SecurityGroup } from '../SecurityGroup';
import { Status } from '../../core';

@InputType()
export class CreateSecurityPolicyInput {
  @Field()
  name: string;

  @Field(t=>ID)
  securityGroup: Ref<SecurityGroup>;

  @Field(t=>Status)
  status: Status;

  @Field(t=>ID)
  domain: Ref<Domain>;

  @Field(t=>[ID])
  permissions: Ref<Permission>[]
}
