import { graphqlApi } from '@/apis/graphql';
import { GQNode } from '@/apis/query-builder';
import { buildUserGQNode } from '@/apis/queries/user';
import { IPerson, Person } from '@/models/person';
import { save, load } from '@/utils/ssr-helper';

const gqNode: GQNode = buildUserGQNode('fa93hws', ['avatarUrl', 'email', 'url', 'email'])

const dataResolver: Promise<IPerson> = new Promise((resolve, reject) => {
  const cache = load('author');
  if (cache !== undefined)
    return resolve(cache);
    graphqlApi.post<IPerson>(gqNode).then(user => {
    const author = new Person(user);
    save(author, 'author');
    resolve(author);
  }).catch(reject)
});

export default dataResolver;