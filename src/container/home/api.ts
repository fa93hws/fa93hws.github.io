import { baseApi } from '@/apis/base-graphql';
import { buildIssuesGQNode, buildAuthorGQNode, buildLabelGQNode } from '@/apis/graphql/queries/blogs';
import { GQNode } from '@/utils/graphql/query-builder';
import { save, load } from '@/utils/ssr-helper';
import { IPageable } from '@/models/pageable';
import { IBlog } from '@/models/blog';
import { Repository, IRawRepository } from '@/models/repository';

const queryNode: GQNode = buildIssuesGQNode(['blog'], 10, [
  'totalCount', {
    name: 'nodes',
    children: ['createdAt', 'title', 'body', 'number',
      buildLabelGQNode(['color', 'description', 'name']),
      buildAuthorGQNode(['name', 'avatarUrl', 'url'])
    ]
  }
]);

const dataResolver: Promise<IPageable<IBlog>> = new Promise((resolve, reject) => {
  const cache = load<IPageable<IBlog>>('blogList');
  if (cache !== undefined)
    return resolve(cache);
  baseApi.post<IRawRepository>(queryNode).then(raw => {
    const repository = new Repository();
    repository.parseGQResponse(raw);
    save(repository.blogs, 'blogList');
    resolve(repository.blogs);
  }).catch(reject)
});

export default dataResolver;