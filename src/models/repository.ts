import bindthis from '@/utils/decorators/bindthis';
import BaseModel, { IGQModel } from './base';
import { IBlog, IRawBlog, BlogModel } from './blog';
import { IPageable } from './pageable';

export interface IRawRepository {
  issues: {
    totalCount: number;
    nodes: IRawBlog[];
  }
}
export interface IRepository {
  blogs?: IPageable<IBlog>;
}

export class Repository extends BaseModel implements IRepository, IGQModel {
  public blogs?: IPageable<IBlog>;

  @bindthis public parseGQResponse(repo: IRawRepository) {
    const rawBlogs = repo.issues;
    const totalCount = rawBlogs.totalCount;
    const blogs: IBlog[] = [];
    rawBlogs.nodes.forEach(r => {
      const blog = new BlogModel();
      blog.parseGQResponse(r);
      blogs.push(blog);
    });
    this.blogs = {
      totalCount,
      contents: blogs
    }
  }
}

