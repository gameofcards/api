import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg } from 'type-graphql';
import { Deck, DeckModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => Deck)
export default class DeckResolver {
  @Query((returns) => Deck)
  async deck(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return DeckModel.findById(id);
  }

  @Query((returns) => [Deck])
  async decks() {
    return DeckModel.find({});
  }
}
