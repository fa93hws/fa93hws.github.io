type userField = 'avatarUrl' | 'id' | 'name' | 'url' | 'email';
export function findUserByLogin(login: string, requireFields: userField[]) {
  return `user(login: "${login}") {
    ${requireFields.join(',')}
  }`
}