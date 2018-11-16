import React, { Suspense, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';
import mdStyles from '@/assets/styles/github-markdown.less';

import PageLoading from '@/containers/page-loading';
import ErrorBoundary from '@/components/error-boundary';
import TopBar from '@/components/top-bar';
import lazyComponentFactory from '@/utils/lazy-comp';
import { render } from '@/utils/markdown/renderer';
import { IBlog } from '@/models/blog';
import dataResolverBuilder from './api';
import styles from './style.less';
import { LabelSection } from '@/components/label';

function BlogsPage({ data: blog }: { data: IBlog }) {
  const [wrapperClass, setWrapperClass] = useState(styles.article);

  useEffect(() => {
    setWrapperClass([styles.article, styles.loaded].join(' '));
  }, [])

  return (
    <article className={wrapperClass}>
      <header className={styles.header}>
        <h1 className={styles.title}>
          {blog.title}
        </h1>
        <time className={styles.time}>
          {blog.timeStr}
        </time>
      </header>
      <section className={[mdStyles.markdownBody, styles.body].join(' ')}
        dangerouslySetInnerHTML={{
          __html: render(blog.content)
        }}
      />
      <LabelSection labels={blog.labels} />
    </article>
  );
}

function isBlogIdValid(id: string) {
  const int = parseInt(id, 10);
  const float = parseFloat(id);
  return !isNaN(int) && int === float && int > 0
}
interface IMatchProps {
  blogId: string;
}
export default function Wrapper(props: RouteComponentProps<IMatchProps>) {
  const blogIdStr = props.match.params.blogId;
  if (!isBlogIdValid(blogIdStr))
    window.location.replace('/404');
  const blogId = parseInt(blogIdStr, 10);
  const dataResolver = dataResolverBuilder(blogId);
  const Fetcher = lazyComponentFactory(dataResolver, BlogsPage);

  return (
    <main className="main__container">
      <header className="global__header">
        <TopBar title="夏目天子的博客" />
      </header>
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <Fetcher />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}