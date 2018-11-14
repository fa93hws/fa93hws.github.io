import { baseApi } from '@/apis/base-graphql';
import { buildUserGQNode } from '@/apis/graphql/queries/user';
import buildQuery, { GQNode } from '@/utils/graphql/query-builder';
import { IPerson, Person } from '@/models/person';
import { save, load } from '@/utils/ssr-helper';

const gqNode: GQNode = buildUserGQNode('fa93hws', ['avatarUrl', 'email', 'url', 'email'])
const query = '{' + buildQuery(gqNode) + '}';

const dataResolver: Promise<IPerson> = new Promise((resolve, reject) => {
  const cache = load('author');
  if (cache !== undefined)
    return resolve(cache);
  baseApi.post(query).then(res => {
    const author = new Person(res.data.data.user);
    save(author, 'author');
    resolve(author);
  }).catch(reject)
});

export default dataResolver;