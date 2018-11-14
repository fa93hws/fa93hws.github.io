import BaseModel, { IGQModel } from './base';
import { ILabelModel } from './label';
import { IPerson } from './person';
import bindthis from '@/utils/decorators/bindthis';

export interface IRawBlog {
  createdAt?: string;
  title?: string;
  body?: string;
  labels?: {
    nodes: Array<ILabelModel>;
  };
  author?: IPerson;
  number?: number;
}
export interface IBlog {
  createdAt?: string;
  timeStr?: string;
  title?: string;
  body?: string;
  labels?: Array<ILabelModel>;
  author?: IPerson;
  id?: string;
  number?: number;
}

export class BlogModel extends BaseModel implements IBlog, IGQModel {
  public createdAt: string;
  public title: string;
  public body: string;
  public labels: Array<ILabelModel>;
  public author: IPerson;
  public id: string;
  public number: number;

  private _timeStr: string;
  public get timeStr(): string | undefined {
    if (this._timeStr === undefined && this.createdAt !== undefined && this.createdAt !== '') {
      this._timeStr = this.createdAt.split('T')[0]
      .replace('-', '年')
      .replace('-', '月') + '日';
    }
    return this._timeStr
  }

  @bindthis public parseGQResponse(blog: IRawBlog) {
    Object.keys(blog).forEach(k => {
      if (k === 'labels')
        this.labels = blog[k].nodes.filter(l => l.name !== 'blog');
      else
        (this as any)[k] = (blog as any)[k];
    })
  }
}
