import { Field, ID, InputType, Int } from 'type-graphql';

import { InstanceId } from '../../../../types';

@InputType()
export class CreatePresidentsRoundInput {
  @Field((type) => Int)
  number: number;
}
