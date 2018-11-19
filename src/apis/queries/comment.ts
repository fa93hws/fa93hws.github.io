import { GQNode, GQSearch } from "@/apis/query-builder";
import { buildAuthorGQNode } from './user';

export function buildReactionsGQNode(): GQNode {
  return {
    name: 'reactionGroups',
    children: [
      'content',
      {
        name: 'users',
        children: ['totalCount']
      }
    ]
  }
}

export function buildCommentsGQNode(search: GQSearch): GQNode {
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
        buildReactionsGQNode()
      ]
    }]
  }
}
