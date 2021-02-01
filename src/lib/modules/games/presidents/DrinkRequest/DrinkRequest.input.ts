import { Field, ID, InputType } from 'type-graphql';

import { ObjectId } from 'mongodb';
import { PresidentsPlayer } from '../PresidentsPlayer';
import { Ref } from '@typegoose/typegoose';

@InputType()
export class SendDrinkRequestRequest {
  @Field()
  fromPlayer: string;

  @Field()
  toPlayer: string;

  @Field()
  id: string;
}

@InputType()
export class FulfillDrinkRequestRequest {
  @Field()
  forPlayer: string;

  @Field()
  drinkId: string;

  @Field()
  id: string;
}

export interface CreateDrinkRequestInput {
  fromPlayer: Ref<PresidentsPlayer>;
  toPlayer: Ref<PresidentsPlayer>;
  game: ObjectId;
}
