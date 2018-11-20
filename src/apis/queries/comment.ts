import { GQNode, GQSearch } from "@/apis/query-builder";
import { buildAuthorGQNode } from './user';

export function buildReactionsGQNode(loggedIn: boolean): GQNode {
  const children = [
    'content',
    {
      name: 'users',
      children: ['totalCount']
    }
  ];
  if (loggedIn === true)
    children.push('viewerHasReacted');
  return {
    name: 'reactionGroups',
    children
  }
}

export function buildCommentsGQNode(search: GQSearch, loggedIn: boolean = false): GQNode {
  return {
    name: 'comments',
    search,
    children: ['totalCount', {
      name: 'nodes',
      children: [
        'publishedAt', 'id', 'body', 
        {
          name: 'bodyHTML',
          alias: 'content'
        },
        buildAuthorGQNode(['name', 'avatarUrl', 'url', 'email', 'id']),
        buildReactionsGQNode(loggedIn)
      ]
    }]
  }
}
