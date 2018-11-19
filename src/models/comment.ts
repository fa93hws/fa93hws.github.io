import BaseModel, { IGQModel } from "./base";
import bindthis from "@/utils/decorators/bindthis";
import { IPerson, Person, IRawPerson } from "./person";
import { IReactionGroups, ReactionGroupsModel, IRawReactionGroup } from "./reacton-groups";

export interface IRawComment {
  id: string;
  publishedAt: string;
  content: string;
  author: IRawPerson;
  body: string;
  reactionGroups?: ReadonlyArray<IRawReactionGroup>;
}

export interface IComment {
  id?: string;
  publishedAt?: string;
  // publishedAt in yyyy-mm-dd format or xxx 小时前
  timeStr?: string;
  content?: string;
  author?: IPerson;
  body?: string;
  reactions?: IReactionGroups;
}

export class CommentModel extends BaseModel implements IComment, IGQModel {
  public id?: string;
  public publishedAt?: string;
  public author?: IPerson;
  private _timeStr?: string;  
  public get timeStr() {
    const published = new Date(this.publishedAt!);
    const diff = new Date().getTime() - published.getTime();
    if (diff < 60 * 1000) 
      return `${Math.floor(diff/1000)} 秒前`;
    else if (diff < 3600 * 1000)
      return `${Math.floor(diff / 60 / 1000)} 分钟前`;
    else if (diff < 24 * 3600 * 1000)
      return `${Math.floor(diff / 3600 / 1000)} 小时前`;
    
    if (this._timeStr === undefined && this.publishedAt !== undefined && this.publishedAt !== '') {
      this._timeStr = this.publishedAt.split('T')[0]
      .replace('-', '年')
      .replace('-', '月') + '日';
    }
    return this._timeStr
  }
  public content?: string;
  public body?: string;
  public reactions?: IReactionGroups;

  constructor(params: any) {
    super(params);
    this.author = new Person(params.author);
    this.reactions = new ReactionGroupsModel(params.reactionGroups!);
  }

  @bindthis public parseGQResponse(raw: IRawComment) {
    this.id = raw.id;
    this.publishedAt = raw.publishedAt;
    this.content = raw.content;
    this.author = new Person(raw.author);
    this.reactions = new ReactionGroupsModel(raw.reactionGroups!);
  }
}