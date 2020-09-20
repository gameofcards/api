import {
  prop as Property,
  defaultClasses,
  Ref,
  ReturnModelType,
  DocumentType,
  modelOptions as ModelOptions,
  plugin as Plugin,
} from '@typegoose/typegoose';
import { ObjectType, Field } from 'type-graphql';
import * as autopopulate from 'mongoose-autopopulate';
import Player from '../Player/Player';
import { SecurityDomain, SecurityDomainModel } from '../SecurityDomain';
import { CreateUserInput } from '../../../types';
import { InstanceId } from '../../../types';
import ClassBase from '../ClassBase';

@ModelOptions({
  schemaOptions: {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
})
@Plugin(autopopulate)
@ObjectType({ implements: ClassBase })
export default class User {
  public _id!: InstanceId;

  @Property({ required: true })
  @Field()
  public username!: string;

  @Property({ required: true })
  @Field()
  public email!: string;

  @Property({ required: true })
  @Field()
  public displayName!: string;

  @Property({ required: true })
  @Field()
  public password!: string;

  @Property()
  @Field()
  public token?: string;

  @Property({ autopopulate: true, ref: 'SecurityDomain' })
  @Field((type) => SecurityDomain)
  public security!: Ref<SecurityDomain>;

  @Property({ ref: 'Player' })
  @Field((type) => [Player])
  public playerRecords!: Ref<Player>[];

  public static async createInstance(this: ReturnModelType<typeof User>, input: CreateUserInput) {
    const security = await SecurityDomainModel.findOne({ name: 'user' });
    const user = {
      ...input,
      security,
      token: '',
    };
    const instance = await this.create(user);
    return instance;
  }

  public async addPlayerRecord(this: DocumentType<typeof User>, playerRecord: DocumentType<typeof Player>) {
    this.playerRecords.push(playerRecord);
    return await this.save();
  }
}
