import { Field, InputType, Int } from 'type-graphql';

@InputType()
export class CreateSuitInput {
  @Field()
  name: string;

  @Field()
  character: string;

  @Field((type) => Int)
  value: number;

  @Field()
  color: string;
}
