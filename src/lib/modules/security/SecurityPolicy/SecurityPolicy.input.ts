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

  @Field((type) => ID)
  securityGroup: Ref<SecurityGroup>;

  @Field((type) => Status)
  status: Status;

  @Field((type) => ID)
  domain: Ref<Domain>;

  @Field((type) => [ID])
  permissions: Ref<Permission>[];
}
