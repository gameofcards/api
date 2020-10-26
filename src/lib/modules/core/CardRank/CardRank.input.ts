import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateCardRankInput {
  @Field()
  name: string;

  @Field()
  character: string;

  @Field((type) => Int)
  value: number;
}
