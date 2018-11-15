import { GQNode } from "@/apis/query-builder";
import { UserFieldsType } from "./user";

export function buildIssuesGQNode(labels: string[], limit: number, nodes: Array<GQNode | string>): GQNode {
  if (labels.findIndex(l => l === 'blog') < 0)
    labels.push('blog');

  return {
    name: 'repository',
    search: {
      name: 'fa93hws.github.io',
      owner: 'fa93hws'
    },
    children: [{
      name: 'issues',
      search: {
        labels,
        first: limit
      },
      children: [...nodes]
    }]
  }
}

type LabelFieldsType = 'color' | 'name' | 'description';
export function buildLabelGQNode(fields: LabelFieldsType[]): GQNode {
  return {
    name: 'labels',
    search: { first: 100 },
    children: [{
      name: 'nodes',
      children: fields
    }]
  }
}

export function buildAuthorGQNode(fields: UserFieldsType[]): GQNode {
  return {
    name: 'author',
    on: 'User',
    children: fields
  }
}
