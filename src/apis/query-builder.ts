export interface GQSearch {
  [field: string]: string | number | Array<string|number>;
}
export interface GQNode {
  name: string;
  search?: GQSearch;
  children?: Array<GQNode | string>;
  on?: string;
  alias?: string;
}

function translateSearch(params: GQSearch): string {
  const searchStr: string[] = [];
  Object.keys(params).forEach(key => {
    searchStr.push(`${key}: ${JSON.stringify(params[key])}`);
  });
  return `(${searchStr.join(',')})`;
}

function translateAlias(alias: string | undefined, query: string): string {
  if (alias === undefined) return query;
  else return `${alias}: ${query}`;
}

function translateNode(node: GQNode | string): string {
  if (typeof node === 'string')
    return node;
  // no children means no search or on
  else if (node.children === undefined || node.children.length === 0)
    return translateAlias(node.alias, node.name);

  let query: string[] = [node.name];
  if (node.search !== undefined)
    query.push(translateSearch(node.search));

  // translate children
  const fields: string[] = [];
  node.children.forEach(c => {
    fields.push(translateNode(c));
  });
  const fieldStr = fields.join(',');

  if (node.on === undefined)
    query.push(`{ ${fieldStr} }`);
  else {
    query = query.concat(['{','...', 'on', node.on, '{', fieldStr, '} }']);
  }
  return translateAlias(node.alias, query.join(' '));
}

export default function buildQuery(nodes: Array<GQNode> | GQNode): string {
  let query: string[];
  if (Array.isArray(nodes))
    query = nodes.map(translateNode);
  else
    query = [translateNode(nodes)];
  return query.join(',');
}