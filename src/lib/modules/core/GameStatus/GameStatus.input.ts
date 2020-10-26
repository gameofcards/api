import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateGameStatusInput {
  @Field()
  value: string;
}
