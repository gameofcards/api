import { Field, ID, InputType } from 'type-graphql';

import { InstanceId } from './../../../../types';
import { ObjectId } from 'mongodb';
import { PresidentsPlayer } from '../PresidentsPlayer';
import { Ref } from '@typegoose/typegoose';

@InputType()
export class SendDrinkRequestInput {
  @Field((type) => ID)
  fromPlayer: ObjectId;

  @Field((type) => ID)
  toPlayer: ObjectId;

  @Field((type) => ID)
  id: ObjectId;
}

export interface CreateDrinkRequestInput {
  fromPlayer: Ref<PresidentsPlayer>;
  toPlayer: Ref<PresidentsPlayer>;
  game: InstanceId;
}
