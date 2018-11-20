import React, { 
  Suspense,
  useState,
  useEffect,
  useMemo,
  useRef,
  createContext,
  lazy
} from 'react';
import { RouteComponentProps, withRouter } from 'react-router';

import gistLoader from '@/apis/gist-loader';
const Comments = lazy(() => import(/* webpackChunkName: "comment" */'@/containers/comments'));
import PageLoading from '@/containers/page-loading';
import { leftNavStore } from '@/containers/nav-left';
import { topBarStore } from '@/containers/top-bar';
import ErrorBoundary from '@/components/error-boundary';
import { LabelSection } from '@/components/label';
import lazyComponentFactory from '@/utils/lazy-comp';
import { useScroll } from '@/utils/hooks/dom-listener';
import { render } from '@/utils/markdown/renderer';
import { IBlog } from '@/models/blog';
import dataResolverBuilder from './api';
import styles from './style.less';
import '@/assets/styles/github-markdown.less';
import '@/assets/styles/gist.less';

export const BlogContext = createContext<IBlog | null>(null);

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
    <BlogContext.Provider value={blog}>
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
        <Suspense fallback={<PageLoading />}>
          <Comments />
        </Suspense> :
        null
      }
    </BlogContext.Provider>
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

  const Fetcher = useMemo(() => {
    const blogId = parseInt(blogIdStr, 10);
    const dataResolver = dataResolverBuilder(blogId);
    return lazyComponentFactory(dataResolver, BlogsPage)
  }, [blogIdStr]);
  
  if (!isBlogIdValid(blogIdStr))
    window.location.replace('/404');

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
