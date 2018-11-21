import React, { useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import authApi from '@/apis/auth';
import parseSearch from '@/utils/parse-search';
import { topBarStore } from '@/components/top-bar';
import PageLoading from '@/containers/page-loading';
import styles from './style.less';

function alertError() {
  alert('回调参数错误');
  window.location.replace('/');
}

function AuthPage(props: RouteComponentProps) {
  const [, setTitle] = topBarStore.useState<string>('title');

  useEffect(() => {
    setTitle('Auth');

    const obj = parseSearch(props.location.search);
    if (obj.code !== undefined && obj.blog_number !== undefined) {
      authApi.getToken(obj.code).then(token => {
        authApi.saveToken(token);
        window.location.replace(`/blog/${obj.blog_number}`);
      })
      .catch(err => {
        authApi.removeToken();
        alertError();
      });
    } else
      alertError();
  }, []);

  return (
    <main className={styles.container}>
      <article className={styles.article}>
        <h1 className={styles.heading}>
          登录中...
        </h1>
        <PageLoading />
      </article>
    </main>
  );
}

export default withRouter(AuthPage);