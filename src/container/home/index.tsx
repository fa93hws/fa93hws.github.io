import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';

import lazyComponentFactory from '@/utils/lazy-comp';
import { IBlog } from '@/models/blog';
import { IPageable } from '@/models/pageable';
import { ILabelModel } from '@/models/label';
import ErrorBoundary from '@/components/error-boundary';
import Label from '@/components/label';
import icons from '@/assets/styles/icon-font.css';
import dataResolver from './api';
import styles from './style.less';
import PageLoading from '../page-loading';

const BlogLabels = ({ labels }: { labels: ILabelModel[] }) => (
  <section className={styles.labelSection}>
    <ul className={styles.labelList}>
    {
      labels.map(l => (
        <li className={styles.labelItem} key={l.name}>
          <Label label={l} />
        </li>
      ))
    }
    </ul>
  </section>
);

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
      <BlogLabels labels={blog.labels} /> :
      null
    }
  </li>
);

function Home({ data }: { data: IPageable<IBlog>}) {
  return (
    <React.Fragment>
      <header className={styles.header}>
        <div className={styles.top}>
          <i className={icons.iconShare2 + ' ' + styles.icon} />
        </div>
        <h1 className={styles.headerTitle}>
          兴趣使然的博客
        </h1>
        <h4 className={styles.headerSubTitle}>
          人生的追求就是白嫖 Github
        </h4>
      </header>
      <main className={styles.body}>
        <ul>
        {
          data.contents.map((blog) => (
            <BlogCard blog={blog} key={blog.number} />
          ))
        }
        </ul>
      </main>
    </React.Fragment>
  );
}

const Fetcher = lazyComponentFactory<IPageable<IBlog>>(dataResolver, Home);

const Wrapper = () => (
  <main className={`main__container ${styles.container}`}>
    <ErrorBoundary>
      <Suspense fallback={<PageLoading />}>
        <Fetcher />
      </Suspense>
    </ErrorBoundary>
  </main>
);
export default Wrapper;