import React, { useState, Suspense, LazyExoticComponent, ComponentType, useEffect } from 'react';

import lazyComponentFactory, { emptyComponent } from '@/utils/lazy-comp';
import dataResolverBuilder from './api';
import PageLoading from '../page-loading';
import styles from './style.less';
import { RouteComponentProps, Redirect } from 'react-router';
import ErrorBoundary from '@/components/error-boundary';

function BlogsPage({ data }: { data: any }) {
  return (
    <main className="main__container">
      123
    </main>
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
      <ErrorBoundary>
        <Suspense fallback={<PageLoading />}>
          <Fetcher />
        </Suspense>
      </ErrorBoundary>
    </main>
  )
}