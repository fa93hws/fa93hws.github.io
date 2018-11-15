import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';
import buildQuery, { GQNode } from '@/utils/graphql/query-builder';
import bindthis from '@/utils/decorators/bindthis';

interface cache {
  // is the request sent and waiting for response
  pendingFlag: boolean;
  data?: any;
}
class GQCacheManager {
  // to distinguish between different requests
  private _requestIdx: number = 0;
  public get requestIdx() {
    return this._requestIdx;
  }

  private _cache: { [idx: number]: cache } = {};
  public changePending(idx: number, val: boolean) {
    if (this._cache[idx] === undefined)
      this._cache[idx] = { pendingFlag: val };
    else
      this._cache[idx].pendingFlag = val;
  }
  public isPending(idx: number) {
    return this._cache[idx] !== undefined && this._cache[idx].pendingFlag;
  }
  public setCache(idx: number, data: any) {
    if (this._cache[idx] === undefined)
      throw new Error(`cache idx=${idx} is not init yet and hence can not set cache for it.`);
    this._cache[idx].pendingFlag = false;
    this._cache[idx].data = data;
  }
  public getCache(idx: number): any {
    if (this._cache[idx] === undefined)
      throw new Error(`cache idx=${idx} is not init yet and hence can not get cache from it.`);
    return this._cache[idx].data;
  }

}

export default class BaseGraphqlApi {
  private axiosInstance: AxiosInstance;
  // when an query is about to sent, it will be push into the queue and send to the server
  // after 100ms together with other queries in the queue.
  private pendingQueries: GQNode[] = [];
  // when the request is sent back, it is saved here for one tick
  private cache: GQCacheManager = new GQCacheManager();


  constructor(config: AxiosRequestConfig = {}) {
    if (config.baseURL === undefined || config.baseURL === '')
      config.baseURL = 'https://bmnse8qibl.execute-api.ap-southeast-2.amazonaws.com/production';
    this.axiosInstance = axios.create(config);
  }

  @bindthis private wait(requestIdx: number, callback: (data: any) => void) {
    if (this.cache.isPending(requestIdx))
      setTimeout(() => this.wait(requestIdx, callback), 100);
    else
      callback(this.cache.getCache(requestIdx));
  };

  private submit = (requestIdx: number) => new Promise((resolve, reject) => {
    // request has been sent, wait for the response
    if (this.cache.isPending(requestIdx))
      return this.wait(requestIdx, resolve);

    const queries = this.pendingQueries.map(buildQuery);
    this.pendingQueries = [];
    const query = '{' + queries.join(',') + '}';
    this.cache.changePending(requestIdx, true);

    this.axiosInstance.post('', { query }).then(res => {
      if ('errors' in res.data)
        reject(res.data.errors);
      else {
        this.cache.setCache(requestIdx, res.data.data);
        resolve(res.data.data)
      }
    }).catch(reject);
  });

  public post = <T>(queryNodes: GQNode) => new Promise<T>((resolve, reject) => {
    this.pendingQueries.push(queryNodes);
    const requestIdx = this.cache.requestIdx + 1;
    const varName = queryNodes.name;
    setTimeout(() => {
      this.submit(requestIdx).then((res: any) => {
        resolve(res[varName]);
      }).catch(reject);
    }, 100);
  })
}

export const baseApi = new BaseGraphqlApi();
