import { defaultClasses, prop as Property , Ref, ReturnModelType, modelOptions as ModelOptions, plugin as Plugin } from '@typegoose/typegoose';
import { ObjectType, Field, Int } from 'type-graphql';
import * as autopopulate from 'mongoose-autopopulate';
import PresidentsPlayer from '../PresidentsPlayer/PresidentsPlayer';
import Card from '../../../core/Card/Card';
import { PresidentsTurnInput } from '../../../../types';
import { InstanceId } from '../../../../types';
import ClassBase from '../../../core/ClassBase';

@ModelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
@Plugin(autopopulate)
@ObjectType({implements: ClassBase})
export default class PresidentsTurn {

  public _id: InstanceId

  @Property({ ref: 'PresidentsPlayer' })
  @Field(type => PresidentsPlayer)
  public forPlayer!: Ref<PresidentsPlayer>

  @Property({ required: true, default: Date.now })
  @Field(() => String)
  public takenAt!: Date

  @Property({ autopopulate: true, ref: 'Card' })
  @Field(type => [Card])
  public cardsPlayed!: Ref<Card>[]

  @Property({ required: true })
  @Field()
  public wasPassed!: boolean

  @Property({ required: true })
  @Field()
  public wasSkipped!: boolean

  @Property({ required: true })
  @Field()
  public didCauseSkips!: boolean

  @Property({ required: true })
  @Field(type => Int)
  public skipsRemaining!: number

  @Property({ required: true })
  @Field()
  public endedRound!: boolean

  public static async createInstance(this: ReturnModelType<typeof PresidentsTurn>, input: PresidentsTurnInput) {
    let { forPlayer, cardsPlayed, wasPassed } = input;
 
    const turn = {
      forPlayer, 
      cardsPlayed,
      wasPassed,
      wasSkipped: false,
      didCauseSkips: false,
      skipsRemaining: 0,
      endedRound: false
    };
  }
}
