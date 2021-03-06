import { graphqlApi } from '@/apis/graphql';
import {
  buildRepositoryGQNode,
  buildIssuesGQNode,
  buildLabelGQNode
} from '@/apis/queries/blog';
import { buildAuthorGQNode } from '@/apis/queries/user';
import { GQNode } from '@/apis/query-builder';
import { save, load } from '@/utils/ssr-helper';
import { IPageable } from '@/models/pageable';
import { IBlog } from '@/models/blog';
import { Repository, IRawRepository } from '@/models/repository';

const queryNode: GQNode = buildRepositoryGQNode([
  buildIssuesGQNode(['blog'], 10, [
    'totalCount', {
      name: 'nodes',
      children: ['createdAt', 'title', 'number',
      {
        name: 'bodyHTML',
        alias: 'abstract'
      },
        buildLabelGQNode(['color', 'description', 'name']),
        buildAuthorGQNode(['name', 'avatarUrl', 'url', 'id'])
      ]
    }
  ])
]);

const dataResolver: Promise<IPageable<IBlog>> = new Promise((resolve, reject) => {
  const cache = load<IPageable<IBlog>>('blogList');
  if (cache !== undefined)
    return resolve(cache);
  graphqlApi.post<IRawRepository>(queryNode).then(raw => {
    const repository = new Repository();
    repository.parseGQResponse(raw);
    save(repository.blogs, 'blogList');
    resolve(repository.blogs);
  }).catch(reject)
});

export default dataResolver;