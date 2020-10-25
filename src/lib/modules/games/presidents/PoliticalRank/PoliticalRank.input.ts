import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreatePoliticalRankInput {
  @Field()
  name: string;

  @Field((type) => Int)
  value: number;

}
