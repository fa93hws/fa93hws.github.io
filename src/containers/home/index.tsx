import React, { Suspense, useEffect } from 'react';
import { Link } from 'react-router-dom';

import lazyComponentFactory from '@/utils/lazy-comp';
import { IBlog } from '@/models/blog';
import { IPageable } from '@/models/pageable';
import ErrorBoundary from '@/components/error-boundary';
import { LabelSection } from '@/components/label';
import dataResolver from './api';
import styles from './style.less';
import PageLoading from '../page-loading';
import { useTopBarTitle } from '../top-bar/use-title';

const BlogCard = ({ blog }: { blog: IBlog }) => (
  <li className={styles.blogItem}>
    <article className={styles.blogArticle}>
      <time className={styles.blogTime} dateTime={blog.createdAt}>
        {blog.timeStr}
      </time>
      <Link to={`/blog/${blog.number}`} className="db">
        <h1 className={styles.blogTitle}>
          {blog.title}
        </h1>
      </Link>
      <p className={styles.blogAbstract}>
        {blog.body}
      </p>
    </article>
    {
      blog.labels.length > 0 ?
      <LabelSection labels={blog.labels} /> :
      null
    }
  </li>
);

function Home({ data }: { data: IPageable<IBlog>}) {
  return (
    <section className={styles.body}>
      <ul>
      {
        data.contents.map((blog) => (
          <BlogCard blog={blog} key={blog.number} />
        ))
      }
      </ul>
    </section>
  );
}

const Fetcher = lazyComponentFactory(dataResolver, Home);

export default function Wrapper () {
  const [, setTitle] = useTopBarTitle();
  useEffect(() => {
    setTitle('夏目天子的博客');
  });
  
  return (
    <main className={styles.container}>
      <header className="global__header">
        <h1 className={styles.title}>
          兴趣使然的博客
        </h1>
        <h4 className={styles.subTitle}>
          白嫖使我快乐
        </h4>
      </header>
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <Fetcher />
        </Suspense>
      </ErrorBoundary>
    </main>
  );
};
