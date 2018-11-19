import React, { Suspense, useState, useEffect, useMemo, useRef } from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import gistLoader from '@/apis/gist-loader';
import Comments from '@/containers/comments';
import PageLoading from '@/containers/page-loading';
import { leftNavStore } from '@/containers/nav-left';
import { topBarStore } from '@/containers/top-bar';
import ErrorBoundary from '@/components/error-boundary';
import { LabelSection } from '@/components/label';
import lazyComponentFactory from '@/utils/lazy-comp';
import { render } from '@/utils/markdown/renderer';
import { IBlog } from '@/models/blog';
import dataResolverBuilder from './api';
import styles, { article } from './style.less';
import '@/assets/styles/github-markdown.less';
import '@/assets/styles/gist.less';
import { useScroll } from '@/utils/hooks/dom-listener';

const BlogsPage =  function({ data: blog }: { data: IBlog }) {
  const [wrapperClass, setWrapperClass] = useState(styles.article);
  const [,setIsLeftNavShown] = leftNavStore.useState<Boolean>('display');
  const [,setTitle] = topBarStore.useState<string>('title');
  const [showComments, setShowComments] = useState(false);
  const contentHTML = useMemo(() => render(blog.content!), [blog.content!]);
  const articleRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    setTitle(blog.title!);
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
  }, []);

  // lazy load comments
  useScroll(() => {
    if (showComments === false) {
      const clientHeight = window.innerHeight;
      const scrollHeight = window.scrollY;
      let articleHeight;
      if (articleRef === null || articleRef.current === null)
        articleHeight = 999999;
      else
        articleHeight = articleRef.current.clientHeight;
      if (clientHeight + scrollHeight > articleHeight) {
        setShowComments(true);
      }
    }
  }, [showComments]);

  return (
    <React.Fragment>
      <article className={wrapperClass} ref={articleRef}>
        <header className={styles.header}>
          <h1 className={styles.title}>
            {blog.title}
          </h1>
          <time className={styles.time} dateTime={blog.createdAt}>
            {blog.timeStr}
          </time>
        </header>
        <section className={['markdown-body', styles.body].join(' ')}
          id="blogBody"
          dangerouslySetInnerHTML={{
            __html: contentHTML
          }}
        />
        <LabelSection labels={blog.labels!} />
      </article>
      {
        showComments ?
        <Comments number={blog.number!} blogAuthorId={blog.author!.id!} /> :
        null
      }      
    </React.Fragment>
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
function Wrapper(props: RouteComponentProps<IMatchProps>) {
  const blogIdStr = props.match.params.blogId;
  if (!isBlogIdValid(blogIdStr))
    window.location.replace('/404');

  const Fetcher = useMemo(() => {
    const blogId = parseInt(blogIdStr, 10);
    const dataResolver = dataResolverBuilder(blogId);
    return lazyComponentFactory(dataResolver, BlogsPage)
  }, [blogIdStr]);
  
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

export default withRouter(Wrapper);
