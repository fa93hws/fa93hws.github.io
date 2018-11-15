import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

import bindthis from '@/utils/decorators/bindthis';
import buildQuery, { GQNode } from './query-builder';

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
    if (this._cache[idx] === undefined) {
      this._requestIdx ++;
      this._cache[idx] = { pendingFlag: val };
    }
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
    setTimeout(() => {
      this._cache[idx] = undefined;
    }, 10000);
  }
  public getCache(idx: number): any {
    if (this._cache[idx] === undefined)
      throw new Error(`cache idx=${idx} is not init yet and hence can not get cache from it.`);
    return this._cache[idx].data;
  }

}

export default class GraphqlApi {
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

  @bindthis private wait(requestIdx: number, resolve: (data: any) => void) {
    if (this.cache.isPending(requestIdx))
      setTimeout(() => this.wait(requestIdx, resolve), 100);
    else
      resolve(this.cache.getCache(requestIdx));
  };

  private submit = (requestIdx: number) => new Promise((resolve, reject) => {
    // request has been sent, wait for the response
    if (this.cache.isPending(requestIdx))
      return this.wait(requestIdx, data => {
        if ('errors' in data)
          reject(data);
        else
          resolve(data);
      });

    const queries = this.pendingQueries.map(buildQuery);
    this.pendingQueries = [];
    const query = '{' + queries.join(',') + '}';
    this.cache.changePending(requestIdx, true);

    this.axiosInstance.post('', { query }).then(res => {
      this.cache.setCache(requestIdx, res.data.data);
      if ('errors' in res.data)
        reject(res.data.errors);
      else
        resolve(res.data.data)
    }).catch(reject);
  });

  public post = <T>(queryNodes: GQNode) => new Promise<T>((resolve, reject) => {
    this.pendingQueries.push(queryNodes);
    const requestIdx = this.cache.requestIdx;
    const varName = queryNodes.name;
    setTimeout(() => {
      this.submit(requestIdx).then((res: any) => {
        resolve(res[varName]);
      }).catch(reject);
    }, 100);
  })
}

export const graphqlApi = new GraphqlApi();
