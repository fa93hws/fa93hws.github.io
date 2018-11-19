import React, { useEffect, useState, useMemo, createContext, useContext } from 'react';

import PageLoading from '@/containers/page-loading';
import dataResolverBuilder from './api';
import styles from './style.less';
import { ICommentsManager } from '@/models/comments';
import { IComment } from '@/models/comment';

interface ICommentContext {
  number: number;
  blogAuthorId: string;
}
const CommentContext = createContext<ICommentContext>({ number: -1, blogAuthorId: '' });

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
  const { blogAuthorId } = useContext(CommentContext);
  const authorClass = useMemo(() => {
    if (blogAuthorId === comment.author!.id!)
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

export default function CommentsSection({
  number,
  blogAuthorId
}: {
  number: number,
  blogAuthorId: string
}) {
  const [manager, setManager] = useState<ICommentsManager | null>(null);
  const initialized = useMemo(() => manager !== null, [manager]);
  useEffect(() => {
    dataResolverBuilder(number).then(setManager);
  }, []);

  return (
    <CommentContext.Provider value={{number, blogAuthorId }}>
      <section className={styles.container}>
        {
          initialized ?
          <CommentList manager={manager!} /> :
          <PageLoading />
        }
      </section>
    </CommentContext.Provider>
  );
}