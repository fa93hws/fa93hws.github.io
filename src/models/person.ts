import BaseModel from './base';


export interface IPerson {
  name?: string;
  login?: string;
  avatarUrl?: string;
  url?: string;
  email?: string;
}

export class Person extends BaseModel implements IPerson {
  public name?: string;
  public email?: string;
  public login: string;
  public avatarUrl: string;
  public url?: string;
}