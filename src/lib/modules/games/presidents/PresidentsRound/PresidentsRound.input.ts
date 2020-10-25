import { Field, ID, InputType, Int } from 'type-graphql';

import { InstanceId } from '../../../../types';

@InputType()
export class CreatePresidentsRoundInput {
  @Field((type) => ID)
  game: InstanceId;

  @Field((type) => Int)
  number: number;
}
