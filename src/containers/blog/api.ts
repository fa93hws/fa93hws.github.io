import { graphqlApi } from '@/apis/graphql';
import {
  buildRepositoryGQNode,
  buildIssueGQNode,
  buildAuthorGQNode,
  buildLabelGQNode,
  buildBlogContentGQNode
} from '@/apis/queries/blog';
import { IBlog, BlogModel } from '@/models/blog';


const queryNodeBuilder = (blogId: number) => buildRepositoryGQNode([
  buildIssueGQNode(blogId, ['title', 'createdAt',
    buildAuthorGQNode(['url', 'name', 'avatarUrl', 'email']),
    buildLabelGQNode(['name', 'color', 'description'])
  ]),
  buildBlogContentGQNode(blogId)
]);

const dataResolverBuilder = (blogId: number) => new Promise((resolve, reject) => {
  graphqlApi.post(queryNodeBuilder(blogId)).then(res => {
    const blog = new BlogModel();
    blog.parseGQResponse((<any>res).issue)
    blog.content = (<any>res).blog.text
    resolve(blog);
  }).catch(reject);
});
export default dataResolverBuilder;