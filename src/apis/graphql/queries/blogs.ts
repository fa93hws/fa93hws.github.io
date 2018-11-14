export function buildBlogsQuery(first: number) {
  return `repository(name: "fa93hws.github.io", owner: "fa93hws") {
    issues(labels: ["blog"], first: ${first}) {
      totalCount
      nodes {
        createdAt
        title
        bodyHTML
        labels(first: 100) {
          nodes {
            color
            name
            description
          }
        }
        author {
          avatarUrl
          login
        }
      }
    }
  }`
}