import React, {
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef 
} from 'react';

import { BlogContext } from '@/containers/blog'
import authApi from '@/apis/auth';
import PageLoading from '@/containers/page-loading';
import { IPerson, Person } from '@/models/person';
import styles from './style.less';
import { EAjaxStatus } from '@/types/enum';
import Store from '@/utils/shared-state';
import commentApis from '@/apis/comment';

export const commentEditorStore = new Store();
commentEditorStore.createState('content', '');

function LoginMask() {
  const blog = useContext(BlogContext);
  const callbackUrl = useMemo(() =>
  `${window.location.origin}/auth?blog_number=${blog!.number!}`
, [blog]);

  return (
    <div className={styles.loginMask}>
      <a
        onClick={() => authApi.getToken(callbackUrl)}
        className={styles.login}
      >
        Login
      </a>
    </div>
  );
}

function Editor() {
  const ref = useRef<HTMLTextAreaElement>(null);
  const [text, setText] = commentEditorStore.useState('content');
  const [height, setHeight] = useState<number>(0);
  useEffect(() => {
    if (
      ref.current !== null &&
      ref.current.scrollHeight !== ref.current.clientHeight
    ) setHeight(ref.current!.scrollHeight);
  }, [text]);

  function onChange(e: React.ChangeEvent<HTMLTextAreaElement>): void {
    setText(e.target.value);
  }
  return (
    <textarea
      ref={ref}
      value={text}
      onChange={onChange}
      style={{height}}
      className={styles.editor}
      placeholder="吐槽作者"
    />
  );
}

const EditorWrapper = ({ user, handleSubmit }: {
  user: IPerson;
  handleSubmit: () => void;
}) => (
  <div className={styles.editor}>
    <header className={styles.header}>
      <p className={styles.field}>
        <span className={styles.fieldName}>Github 帐号名:</span>
        <span>{user.login}</span>
      </p>
      <p className={styles.field}>
        <span className={styles.fieldName}>Github 用户名:</span>
        <span>{user.displayName}</span>
      </p>
    </header>
    <section className={styles.editorWrapper}>
      <Editor />
    </section>
  </div>
);

function SuspenseWrapper() {
  const [token, setToken] = useState('');
  const [ajaxState, setAjaxState] = useState<EAjaxStatus>(EAjaxStatus.notSubmitted);
  const [user, setUser] = useState<IPerson>(new Person());
  const EditorElement = useMemo(() => {
    switch(ajaxState) {
      case EAjaxStatus.notSubmitted:
      case EAjaxStatus.pending:
        return <PageLoading />;
      case EAjaxStatus.success:
        return <EditorWrapper user={user} handleSubmit={handleSubmit}/>;
      case EAjaxStatus.failed:
        return <div>载入用户信息失败</div>
    }
  }, [ajaxState, user]);

  const hasToken = useMemo(() => token !== '', [token]);
  const wrapperClass = useMemo(() => {
    let className = styles.container;
    if (!hasToken) className += ' ' + styles.visitor
    return className;
  }, [hasToken]);

  useEffect(() => {
    setToken(authApi.loadToken());
  }, []);

  useEffect(() => {
    if (token === '') return;
    setAjaxState(EAjaxStatus.pending);
    authApi.getUser(token).then(user => {
      setUser(user);
      setAjaxState(EAjaxStatus.success);
    }).catch(err => {
      console.error(err);
      setAjaxState(EAjaxStatus.failed);
    });
  }, [hasToken]);

  const [comment] = commentEditorStore.useState<string>('content');
  const [submitStatus, setSubmitStatus] = useState<EAjaxStatus>(EAjaxStatus.notSubmitted);
  const buttonClass = useMemo(() => {
    if (submitStatus === EAjaxStatus.pending)
      return styles.submit + ' ' + styles.pending;
    else
      return styles.submit;
  }, [submitStatus]);
  const blog = useContext(BlogContext);

  function handleSubmit() {
    if (comment === '' || submitStatus === EAjaxStatus.pending) return;
    setSubmitStatus(EAjaxStatus.pending);
    commentApis.postComment(blog!.number!, comment, token).then(res => {
      setSubmitStatus(EAjaxStatus.success);
      console.log(res);
    }).catch(err => {
      setSubmitStatus(EAjaxStatus.failed);
      console.error(err);
      alert('提交失败');
    });
  }

  return (
    <div className={wrapperClass}>
      <LoginMask />
      {EditorElement}
      <div className={styles.actions}>
        <a
          onClick={handleSubmit}
          className={buttonClass}
        >
          提交
        </a>
      </div>
    </div>
  )
}
export default SuspenseWrapper;
