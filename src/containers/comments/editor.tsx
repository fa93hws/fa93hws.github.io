import React, { useContext, useMemo, useEffect } from 'react';

import { BlogContext } from '@/containers/blog'
import Store from '@/utils/shared-state';
import authApi from '@/apis/auth';
import styles from './style.less';
import { withRouter, RouteComponentProps } from 'react-router';
import parseSearch from '@/utils/parse-search';
import commentApis from '@/apis/comment';

const commentStore = new Store();
commentStore.createState('token', '');

function CommentEditor(props: RouteComponentProps) {
  const blog = useContext(BlogContext);
  const [token, setToken] = commentStore.useState<string>('token');

  const callbackUrl = useMemo(() =>
    `${window.location.origin}/blog/${blog!.number!}`
  , [blog]);
  
  useEffect(() => {
    const obj = parseSearch(props.location.search);
    if (obj.code !== undefined) {
      authApi.getCode(obj.code).then(setToken)
      .catch(err => setToken(''));
    }
  }, []);

  return (
    <div className={styles.editorContainer}>
      {/* <a onClick={() => authApi.auth(callbackUrl)}>
        Login via github
      </a>
      <a onClick={() => commentApis.postComment(blog!.number!, '123', token)}>
        send
      </a> */}
    </div>
  )
}

export default withRouter(CommentEditor);
