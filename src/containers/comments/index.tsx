import React, { useEffect, useState, useMemo, useContext, createContext, useRef } from 'react';

import PageLoading from '@/containers/page-loading';
import { BlogContext } from '@/containers/blog';
import { ICommentsManager } from '@/models/comments';
import { IComment } from '@/models/comment';
import Editor, { commentEditorStore } from './editor';
import dataResolverBuilder from './api';
import styles from './style.less';

function CommentList({ manager, sectionTop }: {
  manager: ICommentsManager;
  sectionTop: number;
}) {
  if (manager.totalCount === 0)
    return <p className={styles.noComment}>还没有评论</p>
  return (
    <React.Fragment>
      <ul className={styles.list}>
      {
        manager.freshComments.map(c => 
          <CommentItem comment={c} key={c.id} sectionTop={sectionTop}/>
        )
      }
      </ul>
    </React.Fragment>
  );
}

function CommentItem ({ comment, sectionTop }: {
  comment: IComment;
  sectionTop: number;
} ) {
  const blog = useContext(BlogContext);
  const authorClass = useMemo(() => {
    if (blog!.author!.id === comment.author!.id!)
      return styles.name + ' ' + styles.isAuthor;
    else
      return styles.name;
  }, [comment.author!.displayName!]);

  const [editorContent, setEditorContent] = commentEditorStore.useState('content');

  function handleReply() {
    const quote = comment!.body!.split('\r\n')
    .map(s => `> ${s}`).join('\r\n');
    if (editorContent === '') setEditorContent(`${quote}\r\n\r\n`)
    else setEditorContent(`${editorContent}\r\n\r\n${quote}\r\n\r\n`);
    window.scrollTo(window.scrollX, sectionTop);
  }

  return (
    <li className={styles.item}>
      <article>
        <header className={styles.header}>
          <div className={styles.headerLeft}>
            <a href={comment.author!.url} target="_blank">
              <img className={styles.avatar} src={comment.author!.avatarUrl!}/>
            </a>
          </div>
          <div className={styles.headerRight}>          
            <p className={styles.row}>
              <a
                target="_blank"
                className={authorClass}
                href={comment.author!.url}
              >
                {comment.author!.displayName}
              </a>
            </p>
            <p className={[styles.row, styles.row1].join(' ')}>
              <time className={styles.time} dateTime={comment.publishedAt}>
                {comment.timeStr}
              </time>
              <a
                onClick={handleReply}
                className={styles.reply}
              >
                回复
              </a>
            </p>
          </div>
        </header>
        <p
          className={[styles.body, 'markdown-body'].join(' ')}
          dangerouslySetInnerHTML={{__html: comment.content!}}
        />
      </article>
    </li>
  );
}

export default function CommentsSection() {
  const blog = useContext(BlogContext);
  const ref = useRef<HTMLElement>(null);
  const [manager, setManager] = useState<ICommentsManager | null>(null);
  const [sectionTop, setSectionTop] = useState<number>(0);
  const initialized = useMemo(() => manager !== null, [manager]);
  useEffect(() => {
    dataResolverBuilder(blog!.number!).then(setManager);
  }, []);

  useEffect(() => {
    if (!initialized) return;
    const top = ref.current!.getBoundingClientRect().top;
    setSectionTop(top + window.scrollY);
  }, [initialized])

  return (
    <section className={styles.container} ref={ref}>
      <Editor />
      {
        initialized ?
        <CommentList manager={manager!} sectionTop={sectionTop} /> :
        <PageLoading />
      }
    </section>
  );
}