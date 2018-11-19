import BaseModel from './base';


export interface IRawPerson {
  name?: string;
  login?: string;
  avatarUrl?: string;
  url?: string;
  email?: string;
  id?: string;
}

export interface IPerson {
  displayName: string;
  login?: string;
  avatarUrl?: string;
  url?: string;
  email?: string;
  id?: string;
}

export class Person extends BaseModel implements IPerson {
  private name?: string;
  // parsed as '无名氏' when name is empty
  public get displayName(): string {
    if (this.name === '' || this.name === null || this.name === undefined)
      return '无名氏';
    else
      return this.name;
  }
  public email?: string;
  public login?: string;
  public avatarUrl?: string;
  public url?: string;
  public id?: string;
}