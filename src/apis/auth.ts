import axios, { AxiosInstance } from 'axios';

import bindthis from '@/utils/decorators/bindthis';

class AuthApi {
  private clientId: string = '8ec990c78739b9faf7d9';
  private axiosInstance: AxiosInstance = axios.create();

  @bindthis public auth(redirectUrl: string) {
    let url = ['https://github.com/login/oauth/authorize'];
    url.push('?client_id=' + this.clientId);
    url.push('&redirect_uri=' + redirectUrl);
    url.push('&scope=public_repo');
    window.location.replace(url.join(''));
  }

  @bindthis public getCode(code: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = 'https://jjaoiq1l2h.execute-api.ap-southeast-2.amazonaws.com/production/' +
      '?code=' + code
      this.axiosInstance.get(url).then(res => {
        if (res.data.access_token !== undefined) {
          console.log(res.data.access_token);
          resolve(res.data.access_token);
        }
        else
          reject('access_token not appear');
      }).catch(reject)
    })    
  }
}

const authApi = new AuthApi();
export default authApi;