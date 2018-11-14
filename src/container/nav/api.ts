import { baseApi } from '@/apis/base-graphql';
import { findUserByLogin } from '@/apis/graphql/queries/users';
import { IPerson, Person } from '@/models/person';

const query = '{' + findUserByLogin('fa93hws', [
  'avatarUrl',
  'name',
  'url',
  'email'
]) + '}';

const dataResolver: Promise<IPerson> = new Promise((resolve, reject) => {
  baseApi.post(query).then(res => {
    const author = new Person(res.data.data.user);
    resolve(author);
  }).catch(reject)
});

export default dataResolver;