import { prop as Property, defaultClasses, Ref, ReturnModelType, modelOptions as ModelOptions, plugin as Plugin } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import PresidentsTurn from '../PresidentsTurn/PresidentsTurn';
import PresidentsGame from '../PresidentsGame/PresidentsGame';
import { PresidentsRoundModel } from '../PresidentsRound';
import { InstanceId } from '../../../../types';
import ClassBase from '../../../core/ClassBase';

@ModelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
})
@ObjectType({implements: ClassBase})
export default class PresidentsRound {
  
  public _id!: InstanceId
  
  @Property({ required: true, default: Date.now })
  @Field()
  public startedAt!: Date

  @Property({ ref: 'PresidentsGame' })
  @Field(type => PresidentsGame)
  public game!: Ref<PresidentsGame>

  @Property({ autopopulate: true, ref: 'PresidentsTurn' })
  @Field(type => [PresidentsTurn])
  public turns!: Ref<PresidentsTurn>[]

  public static async createInstance(game: ReturnModelType<typeof PresidentsGame>) {
    const round = {
      startedAt: new Date(),
      game,
      turns: []
    }
    const instance = new PresidentsRoundModel(round);
    return await instance.save();
  }
}