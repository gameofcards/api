import { Field, InputType } from 'type-graphql';

import { Role } from '../Role';

@InputType()
export class CreateUserInput {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  displayName: string;

  @Field((type) => Role)
  role: Role;
}
