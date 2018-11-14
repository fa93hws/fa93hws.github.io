export type UserFieldsType = 'avatarUrl' | 'name' | 'url' | 'email';
export function buildUserGQNode(login: string, fields: UserFieldsType[]) {
  return {
    name: 'user',
    search: { login },
    children: fields
  }
}