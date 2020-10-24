import { ObjectId } from 'mongodb';
import { InputType, Field, ID } from 'type-graphql';

@InputType()
export class SendDrinkRequestInput {
  @Field((type) => ID)
  fromPlayer: ObjectId;

  @Field((type) => ID)
  toPlayer: ObjectId;

  @Field((type) => ID)
  id: ObjectId;
}
