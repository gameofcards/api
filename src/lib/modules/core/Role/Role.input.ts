import { Field, InputType } from 'type-graphql';

@InputType()
export class CreateRoleInput {
  @Field()
  name: string;
}
