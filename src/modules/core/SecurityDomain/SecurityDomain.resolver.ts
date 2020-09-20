import { ObjectId } from 'mongodb';
import { Resolver, Query, Arg } from 'type-graphql';
import { SecurityDomain, SecurityDomainModel } from '.';
import { ObjectIdScalar } from '../../../types';

@Resolver((of) => SecurityDomain)
export default class SecurityDomainResolver {
  @Query((returns) => SecurityDomain)
  async securityDomain(@Arg('id', (type) => ObjectIdScalar) id: ObjectId) {
    return SecurityDomainModel.findById(id);
  }

  @Query((returns) => [SecurityDomain])
  async securityDomains(): Promise<SecurityDomain[]> {
    return await SecurityDomainModel.find({});
  }
}
