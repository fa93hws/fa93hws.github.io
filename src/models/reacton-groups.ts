import bindthis from '@/utils/decorators/bindthis';

export type IReactionType = 'THUMBS_UP' | 'THUMBS_DOWN' |
'LAUGH' | 'HOORAY' | 'CONFUSED' | 'HEART';
export interface IRawReactionGroup {
  content: IReactionType;
  users: {
    totalCount: number;
  },
  viewerHasReacted: boolean;
}

export interface IReactionGroups {
  up: number;
  down: number;
  love: number;
  laugh: number;
  hooray: number;
  confused: number;
}
export class ReactionGroupsModel implements IReactionGroups {
  public up: number = 0;
  public down: number = 0;
  public love: number = 0;
  public laugh: number = 0;  
  public hooray: number = 0;
  public confused: number = 0;
  
  constructor(params: ReadonlyArray<IRawReactionGroup>) {
    params.forEach(p => {
      switch(p.content) {
        case 'THUMBS_UP':
          this.up = p.users.totalCount;
          break;
        case 'THUMBS_DOWN':
          this.down = p.users.totalCount;
          break;
        case 'HEART':
          this.love = p.users.totalCount;
          break;
        case 'LAUGH':
          this.laugh = p.users.totalCount;
          break;
        case 'HOORAY':
          this.hooray = p.users.totalCount;
          break;
        case 'CONFUSED':
          this.confused = p.users.totalCount;
          break;
        default:
          throw new Error(`unknown reaction type ${p.content}`);
      }
    });
  }
}