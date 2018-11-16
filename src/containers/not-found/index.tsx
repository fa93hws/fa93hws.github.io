import React from 'react';

import styles from './style.less';

const NotFound = () => (
  <main className="main__container">
    <article className={styles.article}>
      <h1 className={styles.title}>404</h1>
      <h4 className={styles.subTitle}>这里什么也没有</h4>
    </article>
  </main>
);
export default NotFound;