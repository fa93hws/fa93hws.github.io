import React from 'react';

import BaseLoading from '@/components/loading/loading-base';
import styles from './style.less';

interface IPageLoadingProps {
  className?: string;
}
export const LoadingSpinner = (props: IPageLoadingProps) => (
  <div className={styles.loading + ' ' + props.className}>
    <BaseLoading />
  </div>
);

const PageLoading = () => (
  <LoadingSpinner />
);
export default PageLoading;