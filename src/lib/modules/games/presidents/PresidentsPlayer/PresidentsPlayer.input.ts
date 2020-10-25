import { Field, ID, InputType, Int } from 'type-graphql';

import { InstanceId } from './../../../../types';
import { Ref } from '@typegoose/typegoose';
import { User } from '../../../core';

@InputType()
export class CreatePresidentsPlayerInput {
  @Field((type) => ID)
  user: Ref<User>;

  @Field((type) => ID)
  game: InstanceId;

  @Field((type) => Int)
  seatPosition: number;
}
