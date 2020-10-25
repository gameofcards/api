import { Field, ID, InputType } from 'type-graphql';

import { Domain } from '../Domain';
import { Ref } from '@typegoose/typegoose';

@InputType()
export class CreateUITaskInput {
  @Field()
  name: string;

  @Field()
  description: string;

  @Field(t=>ID)
  domain?: Ref<Domain>;
}