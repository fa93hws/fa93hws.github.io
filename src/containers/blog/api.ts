import { graphqlApi } from '@/apis/graphql';
import {
  buildRepositoryGQNode,
  buildIssueGQNode,
  buildLabelGQNode,
  buildBlogContentGQNode
} from '@/apis/queries/blog';
import { buildAuthorGQNode } from '@/apis/queries/user';
import { IBlog, BlogModel } from '@/models/blog';
import { save, load } from '@/utils/ssr-helper';


const queryNodeBuilder = (blogId: number) => buildRepositoryGQNode([
  buildIssueGQNode(blogId, ['title', 'createdAt', 'number',
    buildAuthorGQNode(['url', 'name', 'avatarUrl', 'id']),
    buildLabelGQNode(['name', 'color', 'description'])
  ]),
  buildBlogContentGQNode(blogId)
]);

const dataResolverBuilder = (blogId: number) => new Promise((resolve, reject) => {
  const cache = load<IBlog>(`blog_${blogId}`);
  if (cache !== undefined)
    return resolve(cache);
  graphqlApi.post(queryNodeBuilder(blogId)).then(res => {
    const blog = new BlogModel();
    blog.parseGQResponse((<any>res).issue)
    blog.content = (<any>res).blog.text;
    save(blog, `blog_${blogId}`);
    resolve(blog);
  }).catch(reject);
});
export default dataResolverBuilder;