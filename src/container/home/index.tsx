import React from 'react';

import dataResolver from './api';
import styles from './style.less';

export default function Home() {
  dataResolver.then(res => {
    console.log(res);
  })
  return (
    <main className={`main__container ${styles.container}`}>
      123
    </main>
  );
}