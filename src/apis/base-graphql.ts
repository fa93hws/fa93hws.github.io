import axios, { AxiosInstance, AxiosRequestConfig, AxiosPromise } from 'axios';
import bindthis from '@/utils/decorators/bindthis';

export default class BaseGraphqlApi {
  protected axiosInstance: AxiosInstance;
  constructor(config: AxiosRequestConfig = {}) {
    if (config.baseURL === undefined || config.baseURL === '')
      config.baseURL = 'https://bmnse8qibl.execute-api.ap-southeast-2.amazonaws.com/production';
    this.axiosInstance = axios.create(config);
  }

  @bindthis public post(query: string): AxiosPromise {
    return new Promise((resolve, reject) => {
      this.axiosInstance.post('', { query }).then(res => {
        if ('errors' in res.data)
          reject(res.data.errors)
        else
          resolve(res)
      }).catch(reject)
    })
    // return this.axiosInstance.post('', { query });
  }
}

export const baseApi = new BaseGraphqlApi();
