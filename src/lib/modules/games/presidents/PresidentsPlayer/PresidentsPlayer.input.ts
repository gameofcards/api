import { Field, ID, InputType, Int } from 'type-graphql';

import { ObjectId } from 'mongodb';
import { PoliticalRank } from '../PoliticalRank';
import { Ref } from '@typegoose/typegoose';
import { User } from '../../../core';

@InputType()
export class CreatePresidentsPlayerInput {
  @Field((type) => ID)
  user: Ref<User>;

  @Field((type) => ID)
  game: ObjectId;

  @Field((type) => Int)
  seatPosition: number;

  @Field((type) => PoliticalRank)
  politicalRank?: PoliticalRank;
}
