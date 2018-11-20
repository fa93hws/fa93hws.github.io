import axios from 'axios';

import bindthis from '@/utils/decorators/bindthis';

class CommentApis {
  private readonly axiosInstance = axios.create({
    baseURL: 'https://api.github.com/repos/fa93hws/fa93hws.github.io/issues/'
  });

  @bindthis public postComment(issueNumber: number, content: string, token: string) {
    return this.axiosInstance.post(`${issueNumber}/comments?access_token=${token}`, {
      body: content
    });
  }
}

const commentApis = new CommentApis();
export default commentApis;