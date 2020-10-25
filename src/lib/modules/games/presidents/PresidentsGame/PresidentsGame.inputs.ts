import { DocumentType, Ref } from '@typegoose/typegoose';
import { Field, ID, InputType, Int } from 'type-graphql';

import { ObjectId } from 'mongodb';
import { PresidentsGame } from '../PresidentsGame';
import { Role } from '../../../core/Role';
import { User } from '../../../core';

@InputType()
export class PresidentsGameInput {
  @Field()
  name: string;

  @Field((type) => ID)
  createdByUser: Ref<User>;
}

@InputType()
export class JoinPresidentsGameInput {
  @Field((type) => ID)
  id: Ref<PresidentsGame>;

  @Field((type) => ID)
  userId: Ref<User>;
}


@InputType()
export class AddPresidentsTurnInput {
  @Field((type) => ID)
  id: ObjectId;

  @Field((type) => ID)
  forPlayer: ObjectId;

  @Field((type) => [ID])
  cardsPlayed: ObjectId[];

  @Field()
  wasPassed: boolean;
}

@InputType()
export class IdInput {
  @Field((type) => ID)
  id: ObjectId;
}
