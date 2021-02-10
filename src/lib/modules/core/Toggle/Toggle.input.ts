import { Field, InputType } from 'type-graphql';

import { ConfidenceLevels } from './../../../types';

@InputType()
export class CreateToggleInput {
  @Field()
  public name!: string;

  @Field()
  public description!: string;

  @Field()
  public confidenceLevel!: ConfidenceLevels;
}
