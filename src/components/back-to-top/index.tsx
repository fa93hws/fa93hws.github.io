import React, { useState, useMemo } from 'react';

import { useResize, useScroll } from '@/utils/hooks/dom-listener';
import styles from './styles.less';

function toTop() {
  const scrollX = window.scrollX;
  window.scrollTo(scrollX, 0);
}

export default function BackToTop() {
  const [scrollY, setScrollY] = useState<number>(0);
  const [displayHeight, setDisplayHeight] = useState<number>(0);
  const wrapperClass = useMemo(() => {
    const className = styles.container;
    if (scrollY <= displayHeight / 2)
      return className + ' ' + styles.hide;
    else
      return className
  }, [scrollY, displayHeight]);

  useResize(() => {
    setDisplayHeight(window.innerHeight);
  });

  useScroll(() => {
    setScrollY(window.scrollY);
  });

  return (
    <div
      className={wrapperClass}
      onClick={toTop}
    >
      <div className={styles.arrow} />
    </div>
  )
}