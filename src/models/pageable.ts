export interface IPageable<T> {
  totalCount: number;
  contents: T[];
}
