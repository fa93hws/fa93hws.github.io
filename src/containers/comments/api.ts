import { graphqlApi } from '@/apis/graphql';
import {
  buildRepositoryGQNode,
  buildIssueGQNode
} from '@/apis/queries/blog';
import { buildCommentsGQNode } from '@/apis/queries/comment';
import { CommentsManager, CommentsModel, ICommentsManager } from '@/models/comments';

const freshComments = () => {
  const query = buildCommentsGQNode({ first: 10 });
  query.alias = 'freshComments';
  return query;
}
const oldComments = () => {
  const query = buildCommentsGQNode({ last: 10 });
  query.alias = 'oldComments';
  return query;
}
const queryNodeBuilder = (blogId: number) => buildRepositoryGQNode([
  buildIssueGQNode(blogId, [
    freshComments(),
    oldComments()
  ])
]);

const dataResolverBuilder = (
  blogId: number
) => new Promise<ICommentsManager>((resolve, reject) => {
  graphqlApi.post(queryNodeBuilder(blogId)).then((res: any) => {
    const { freshComments, oldComments } = res.issue;
    const fresh = new CommentsModel();
    fresh.parseGQResponse(freshComments);
    const old = new CommentsModel();
    old.parseGQResponse(oldComments);
    const commentsManager = new CommentsManager(fresh, old);
    resolve(commentsManager);
  }).catch(reject);
});
export default dataResolverBuilder;