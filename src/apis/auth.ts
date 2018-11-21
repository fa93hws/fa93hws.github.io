import axios, { AxiosInstance } from 'axios';

import bindthis from '@/utils/decorators/bindthis';
import { IPerson, Person } from '@/models/person';

class AuthApi {
  private clientId: string = 'Iv1.982f55cf525f853f';
  private axiosInstance: AxiosInstance = axios.create();
  private lsKey: string = 'access_token';

  @bindthis public auth(redirectUrl: string) {
    let url = ['https://github.com/login/oauth/authorize'];
    url.push('?client_id=' + this.clientId);
    url.push('&redirect_uri=' + redirectUrl);
    window.location.replace(url.join(''));
  }

  @bindthis public getToken(code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = 'https://jjaoiq1l2h.execute-api.ap-southeast-2.amazonaws.com/production/' +
      '?code=' + code
      this.axiosInstance.get(url).then(res => {
        if (res.data.access_token !== undefined) {
          localStorage.setItem('access_token', res.data.access_token);
          resolve(res.data.access_token);
        }
        else
          reject('access_token not appear');
      }).catch(reject)
    })
  }

  @bindthis public saveToken(code: string): void {
    localStorage.setItem(this.lsKey, code);
  }

  @bindthis public loadToken(): string {
    const token = localStorage.getItem(this.lsKey);
    return token === null ? '' : token;
  }

  @bindthis public removeToken(): void {
    localStorage.removeItem(this.lsKey);
  }

  @bindthis public getUser(token: string): Promise<IPerson> {
    return new Promise((resolve, reject) => {
      this.axiosInstance.get('https://api.github.com/user?access_token=' + token)
      .then(res => {
        resolve(new Person(res.data));
      }).catch(reject);
    });
  }
}

const authApi = new AuthApi();
export default authApi;