import { GQNode } from '../query-builder';

export type UserFieldsType = 'avatarUrl' | 'name' | 'url' | 'email' | 'location' | 'id';
export function buildUserGQNode(login: string, fields: UserFieldsType[]) {
  return {
    name: 'user',
    search: { login },
    children: fields
  }
}

export function buildAuthorGQNode(fields: UserFieldsType[]): GQNode {
  return {
    name: 'author',
    on: 'User',
    children: fields
  }
}