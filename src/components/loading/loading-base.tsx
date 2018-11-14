import React from 'react';

import styles from './style-base.less';

interface IBaseLoadingProps {
  className?: string;
}

const BaseLoading = ({ className = '' }: IBaseLoadingProps) => (
  <div className={`lt-loading__container ${className}`}>
    <div className={`${styles.ltLoadingAnimated} lt-loading__rect lt-loading__rect--0`}></div>
    <div className={`${styles.ltLoadingAnimated} lt-loading__rect lt-loading__rect--1`}></div>
    <div className={`${styles.ltLoadingAnimated} lt-loading__rect lt-loading__rect--2`}></div>
  </div>
)

export default BaseLoading;