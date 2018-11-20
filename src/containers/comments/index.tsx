import React, { useEffect, useState, useMemo, useContext } from 'react';

import PageLoading from '@/containers/page-loading';
import { BlogContext } from '@/containers/blog';
import { ICommentsManager } from '@/models/comments';
import { IComment } from '@/models/comment';
import Editor from './editor';
import dataResolverBuilder from './api';
import styles from './style.less';

function CommentList({ manager }: { manager: ICommentsManager }) {
  if (manager.totalCount === 0)
    return <p className={styles.noComment}>还没有评论</p>
  return (
    <React.Fragment>
      <ul className={styles.list}>
      {
        manager.freshComments.map(c => 
          <CommentItem comment={c} key={c.id}/>
        )
      }
      </ul>
    </React.Fragment>
  );
}

function CommentItem ({ comment }: { comment: IComment} ) {
  const blog = useContext(BlogContext);
  const authorClass = useMemo(() => {
    if (blog!.author!.id === comment.author!.id!)
      return styles.name + ' ' + styles.isAuthor;
    else
      return styles.name;
  }, [comment.author!.displayName!]);

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
              <a className={styles.reply}>
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
  const [manager, setManager] = useState<ICommentsManager | null>(null);
  const initialized = useMemo(() => manager !== null, [manager]);
  useEffect(() => {
    dataResolverBuilder(blog!.number!).then(setManager);
  }, []);

  return (
    <section className={styles.container}>
      <Editor />
      {
        initialized ?
        <CommentList manager={manager!} /> :
        <PageLoading />
      }
    </section>
  );
}