import { Field, ID, InputType } from 'type-graphql';
import { Role, Status } from '../../core';

import { Ref } from '@typegoose/typegoose';
import { SecurityPolicy } from '../SecurityPolicy';

@InputType()
export class CreateSecurityGroupInput {
  @Field()
  name: string;

  @Field(t=>Status)
  status: Status;

  @Field(t=>Role)
  role: Role;

  @Field(t=>ID)
  securityPolicy?: Ref<SecurityPolicy>;
}