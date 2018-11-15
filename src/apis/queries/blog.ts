import { GQNode } from "@/apis/query-builder";
import { UserFieldsType } from "./user";

export function buildRepositoryGQNode(children: GQNode[]): GQNode {
  return {
    name: 'repository',
    search: {
      name: 'fa93hws.github.io',
      owner: 'fa93hws'
    },
    children
  }
}

export function buildIssuesGQNode(labels: string[], limit: number, children: Array<GQNode | string>): GQNode {
  if (labels.findIndex(l => l === 'blog') < 0)
    labels.push('blog');

  return {
    name: 'issues',
    search: {
      labels,
      first: limit
    },
    children
  }
}

export type IssueFieldType = 'title' | 'createdAt' | 'body' | 'bodyHTML' | 'number';
export function buildIssueGQNode(id: number, children: Array<GQNode | IssueFieldType>): GQNode {
  return {
    name: 'issue',
    search: {
      number: id
    },
    children
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

export function buildBlogContentGQNode(blogId: number): GQNode {
  return {
    name: 'object',
    alias: 'blog',
    search: {
      expression: `source:blogs/${blogId}.md`
    },
    on: 'Blob',
    children: ['text']
  }
}