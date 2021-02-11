import { Field, InputType } from 'type-graphql';

import { Role } from '../Role';

@InputType()
export class CreateUserRequest {
  @Field()
  username: string;

  @Field()
  email: string;

  @Field()
  password: string;

  @Field()
  displayName: string;
}

@InputType()
export class LoginRequest {
  @Field()
  username: string;

  @Field()
  password: string;
}

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

  @Field()
  token: string;

  @Field((type) => Role)
  role: Role;
}
