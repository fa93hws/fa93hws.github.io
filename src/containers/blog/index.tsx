import React, { Suspense, useState, useEffect } from 'react';
import { RouteComponentProps } from 'react-router';

import gistLoader from '@/apis/gist-loader';
import PageLoading from '@/containers/page-loading';
import { leftNavStore } from '@/containers/nav-left';
import { topBarStore } from '@/containers/top-bar';
import ErrorBoundary from '@/components/error-boundary';
import { LabelSection } from '@/components/label';
import lazyComponentFactory from '@/utils/lazy-comp';
import { render } from '@/utils/markdown/renderer';
import { IBlog } from '@/models/blog';
import dataResolverBuilder from './api';
import styles from './style.less';
import '@/assets/styles/github-markdown.less';
import '@/assets/styles/gist.less';

const BlogsPage =  function({ data: blog }: { data: IBlog }) {
  const [wrapperClass, setWrapperClass] = useState(styles.article);
  const [,setIsLeftNavShown] = leftNavStore.useState<Boolean>('display');
  const [,setTitle] = topBarStore.useState<string>('title');
  // use memo to calculate the HTML string from md body
  
  useEffect(() => {
    setTitle(blog.title);
    // hide left nav
    setIsLeftNavShown(false);
    // add transform animation at the beginning
    setWrapperClass([styles.article, styles.loaded].join(' '));

    // add css to parse latex formula
    const linkElement = document.createElement('link');
    linkElement.rel="stylesheet";
    linkElement.href="https://cdnjs.cloudflare.com/ajax/libs/KaTeX/0.5.1/katex.min.css"
    document.getElementsByTagName('head')[0].append(linkElement);

    // parse gist
    gistLoader.parseAllIn('blogBody');
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
      <section className={['markdown-body', styles.body].join(' ')}
        id="blogBody"
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
export default class Wrapper extends React.Component<RouteComponentProps<IMatchProps>> {
  // prevent re-ajax since suspense is used
  public shouldComponentUpdate(nextProps: RouteComponentProps<IMatchProps>): boolean {
    return nextProps.location.pathname !== this.props.location.pathname;
  }

  public render() {
    const blogIdStr = this.props.match.params.blogId;
    if (!isBlogIdValid(blogIdStr))
      window.location.replace('/404');
    const blogId = parseInt(blogIdStr, 10);
    const dataResolver = dataResolverBuilder(blogId);
    const Fetcher = lazyComponentFactory(dataResolver, BlogsPage);
  
    return (
      <main>
        <header className="global__header" />
        <ErrorBoundary>
          <Suspense fallback={<PageLoading />}>
            <Fetcher />
          </Suspense>
        </ErrorBoundary>
      </main>
    )
  }
};
