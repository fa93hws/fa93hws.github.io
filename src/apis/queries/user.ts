export type UserFieldsType = 'avatarUrl' | 'name' | 'url' | 'email' | 'location';
export function buildUserGQNode(login: string, fields: UserFieldsType[]) {
  return {
    name: 'user',
    search: { login },
    children: fields
  }
}