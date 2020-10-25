import { Field, ID, InputType, Int } from 'type-graphql';

import { ObjectId } from 'mongodb';
import { PresidentsPlayer } from '../PresidentsPlayer';
import { Ref } from '@typegoose/typegoose';

@InputType()
export class PresidentsTurnInput {
  @Field((type) => ID)
  forPlayer: Ref<PresidentsPlayer>;

  @Field((type) => [ID])
  cardsPlayed: ObjectId[];

  @Field()
  wasPassed: boolean;
}
