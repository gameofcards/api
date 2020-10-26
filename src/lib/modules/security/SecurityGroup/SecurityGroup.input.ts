import { Field, ID, InputType } from 'type-graphql';
import { Role, Status } from '../../core';

import { Ref } from '@typegoose/typegoose';
import { SecurityPolicy } from '../SecurityPolicy';

@InputType()
export class CreateSecurityGroupInput {
  @Field()
  name: string;

  @Field((type) => Status)
  status: Status;

  @Field((type) => Role)
  role: Role;

  @Field((type) => ID)
  securityPolicy?: Ref<SecurityPolicy>;
}
