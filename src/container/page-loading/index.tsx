import React from 'react';

import BaseLoading from '@/components/loading/loading-base';
import styles from './style.less';

const PageLoading = () => (
  <div className={styles.loading}>
    <BaseLoading />
  </div>
);

export default PageLoading;