import { RoleNames } from './../../../types';
import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg, Authorized } from 'type-graphql';
import { Card, CardModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => Card)
export default class CardResolver {
  @Authorized([RoleNames.Administrator])
  @Query((returns) => Card)
  async card(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return CardModel.findById(id);
  }

  @Authorized([RoleNames.Administrator])
  @Query((returns) => [Card])
  async cards(): Promise<Card[]> {
    return CardModel.find({});
  }
}
