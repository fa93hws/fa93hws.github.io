import BaseModel, { IGQModel } from './base';
import { ILabelModel } from './label';
import { IPerson } from './person';
import bindthis from '@/utils/decorators/bindthis';

export interface IRawBlog {
  createdAt?: string;
  title?: string;
  body?: string;
  bodyHTML?: string;
  labels?: {
    nodes: Array<ILabelModel>;
  };
  author?: IPerson;
}
export interface IBlog {
  createdAt?: string;
  title?: string;
  body?: string;
  bodyHTML?: string;
  labels?: Array<ILabelModel>;
  author?: IPerson;
}

export class BlogModel extends BaseModel implements IBlog, IGQModel {
  public createdAt: string;
  public title: string;
  public body: string;
  public bodyHTML: string;
  public labels: Array<ILabelModel>;
  public author: IPerson;

  @bindthis public parseGQResponse(blog: IRawBlog) {
    Object.keys(blog).forEach(k => {
      if (k === 'labels')
        this.labels = blog[k].nodes;
      else
        (this as any)[k] = (blog as any)[k];
    })
  }
}
