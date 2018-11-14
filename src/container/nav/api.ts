import { baseApi } from '@/apis/base-graphql';
import { findUserByLogin } from '@/apis/graphql/queries/users';
import { IPerson, Person } from '@/models/person';
import { save, load } from '@/utils/ssr-helper';

const query = '{' + findUserByLogin('fa93hws', [
  'avatarUrl',
  'name',
  'url',
  'email'
]) + '}';

const dataResolver: Promise<IPerson> = new Promise((resolve, reject) => {
  const cache = load('author');
  if (cache !== undefined)
    resolve(cache);
  baseApi.post(query).then(res => {
    const author = new Person(res.data.data.user);
    save(author, 'author');
    resolve(author);
  }).catch(reject)
});

export default dataResolver;