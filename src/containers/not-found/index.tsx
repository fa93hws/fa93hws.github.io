import React, { useEffect } from 'react';

import { topBarStore } from '@/containers/top-bar';
import styles from './style.less';

const NotFound = function() {
  const [, setTopBarTitle] = topBarStore.useState('title');
  // stop the prerender
  useEffect(() => {
    document.dispatchEvent(new Event('render-trigger'));
    setTopBarTitle('404');
  }, []);

  return (
    <main className={styles.container}>
      <article className={styles.article}>
        <h1 className={styles.title}>Error 404</h1>
        <h4 className={styles.subTitle}>这里什么也没有</h4>
      </article>
    </main>
  );
}
export default NotFound;