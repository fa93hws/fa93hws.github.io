import BaseModel, { IGQModel } from './base';
import { IRawComment, IComment, CommentModel } from './comment';
import { IPageable } from './pageable';
import bindthis from '@/utils/decorators/bindthis';

export interface IRawComments {
  totalCount: number,
  nodes: ReadonlyArray<IRawComment>;
}

export class CommentsModel extends BaseModel implements IPageable<IComment>, IGQModel {
  public totalCount: number = 0;
  public contents: IComment[] = [];

  @bindthis public parseGQResponse(raw: IRawComments) {
    this.totalCount = raw.totalCount;
    raw.nodes.forEach(n => this.contents.push(new CommentModel(n)));
  }
}

// manage two list of comments
// fresh and old comments
export interface ICommentsManager {
  totalCount: number;
  freshComments: IComment[];
  oldComments: IComment[];

  hasUnloaded: boolean;
  numUnloaded: number;
}
export class CommentsManager implements ICommentsManager {
  public totalCount: number = 0;
  public freshComments: IComment[] = [];
  public oldComments: IComment[] = [];

  public get hasUnloaded() {
    return this.numUnloaded !== 0;
  }
  public get numUnloaded() {
    const num = this.totalCount - this.freshComments.length - this.oldComments.length;
    return Math.max(0, num);
  }

  // reorder and combine fresh comments and old comments
  @bindthis private organizeComments() {
    if (!this.hasUnloaded) {
      // everything is in freshComments
      if (this.totalCount !== this.freshComments.length) {
        const lastFreshComment = this.freshComments[this.freshComments.length - 1];
        const idx = this.oldComments.findIndex(c => c.id === lastFreshComment.id);
        const appendComments = this.oldComments.slice(idx + 1);
        this.freshComments = this.freshComments.concat(appendComments);
      }
      this.oldComments = [];
    }
  }

  constructor(fresh: IPageable<IComment>, old: IPageable<IComment>) {
    this.totalCount = fresh.totalCount;
    this.freshComments = fresh.contents;
    this.oldComments = old.contents;
    this.organizeComments();
  }

  @bindthis public addComments(comments: ReadonlyArray<IComment>) {
    comments.forEach(c => this.freshComments.push(c));
    this.organizeComments();
  }
}