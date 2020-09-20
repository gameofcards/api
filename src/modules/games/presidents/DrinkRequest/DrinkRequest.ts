import { prop as Property, Ref, DocumentType, modelOptions as ModelOptions, plugin as Plugin } from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import * as autopopulate from 'mongoose-autopopulate';
import PresidentsPlayer from '../PresidentsPlayer/PresidentsPlayer';
import PresidentsGame from '../PresidentsGame/PresidentsGame';
import { DrinkRequestModel } from './';
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
export default class DrinkRequest {
  
  public _id!: InstanceId

  @Property({ required: true, ref: 'PresidentsPlayer' })
  @Field(type => PresidentsPlayer)
  public fromPlayer!: Ref<PresidentsPlayer>

  @Property({ required: true, ref: 'PresidentsPlayer' })
  @Field(type => PresidentsPlayer)
  public toPlayer!: Ref<PresidentsPlayer>

  @Property({ required: true, ref: 'PresidentsGame' })
  @Field(type => PresidentsGame)
  public game!: Ref<PresidentsGame>

  @Property({ required: true, default: Date.now })
  @Field()
  public sentAt!: Date

  @Property({required: true })
  @Field()
  public fulfilled!: boolean

  @Property()
  @Field()
  public fulfilledAt!: Date

  public async fulfill(this: DocumentType<typeof DrinkRequest>) {
    this.fulfilled = true;
    this.fulfilledAt = new Date();
    return await this.save();
  }
  
  public static async createInstance(
    fromPlayer: DocumentType<typeof PresidentsPlayer>,
    toPlayer: DocumentType<typeof PresidentsPlayer>,
    game: DocumentType<typeof PresidentsGame>) {
    
    const request = { 
      fromPlayer,
      toPlayer,
      game,
      sentAt: new Date(),
      fulfilled: false
    };

    const instance = new DrinkRequestModel(request);
    return await instance.save();
  }

}