import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateStatusInput {
  @Field()
  value: string;
}