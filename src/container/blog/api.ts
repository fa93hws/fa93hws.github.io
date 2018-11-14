// import { Repository } from '@/models/repository';
// import { baseApi } from '@/apis/base-graphql';
// import { buildBlogsQuery } from '@/apis/graphql/queries/blogs';
// import { IPageable } from '@/models/pageable';
// import { IBlog } from '@/models/blog';

// const query = `query {
//   ${buildBlogsQuery(10)}
// }`;
// const dataResolver: Promise<IPageable<IBlog>> = new Promise((resolve, reject) => {
//   baseApi.post(query).then(res => {
//     const repository = new Repository();
//     repository.parseGQResponse(res.data.data.repository);
//     resolve(repository.blogs);
//   }).catch(reject);
// });
// export default dataResolver;