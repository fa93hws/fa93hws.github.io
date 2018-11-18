import React, { useState, useEffect } from 'react';

import { leftNavStore } from '@/containers/nav-left';
import icons from '@/assets/styles/icon-font.css';
import { useResize, useScroll } from '@/utils/hooks/dom-listener';
import Store from '@/utils/shared-state';
import styles from './style.less';

export const topBarStore = new Store();

export default function TopNav() {
  // when vertical scroll bar appear, the right icon need larger margin-right
  const [hasVBar, setHasVBar] = useState(false);
  // when title is shown, display the box shadow as well
  const [titleShown, setTitleShown] = useState(false);
  const [title] = topBarStore.useState('title', '');
  // const [title, setTitle] = useTopBarTitle();
  const [isLeftNavShown, setIsLeftNavShown] = leftNavStore.useState('display');

  useResize(() => {
    const html = document.getElementsByTagName('html')[0];
    setHasVBar(html.scrollHeight > html.clientHeight);
  });

  useScroll(() => {
    setTitleShown(window.scrollY > 90);
  });

  useEffect(() => {
    document.title = title;
  }, [title])

  // right icon class
  let rightIconClass = [icons.iconShare2, styles.icon, styles.iconShare].join(' ');
  if (hasVBar)
    rightIconClass += ' ' + styles.vBarAppear;

  // left icon class
  let leftIconClass = styles.icon;
  if (isLeftNavShown)
    leftIconClass += ' ' + icons.iconCross;
  else
    leftIconClass += ' ' + icons.iconMenu

  // wrapper class
  let wrapperClass = styles.top;
  if (titleShown)
    wrapperClass += ' ' + styles.showTitle;

  return (
    <div className={wrapperClass}>
      <i
        className={leftIconClass}
        onClick={() => setIsLeftNavShown(!isLeftNavShown)}
      />
      <h4 className={styles.title}>
        {title}
      </h4>
      <i className={rightIconClass} />
    </div>
  );
}
