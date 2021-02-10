import { RoleNames } from './../../../types';
import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg, Authorized } from 'type-graphql';
import { Deck, DeckModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => Deck)
export default class DeckResolver {
  @Authorized([RoleNames.Administrator])
  @Query((returns) => Deck)
  async deck(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return DeckModel.findById(id);
  }

  @Authorized([RoleNames.Administrator])
  @Query((returns) => [Deck])
  async decks() {
    return DeckModel.find({});
  }
}
