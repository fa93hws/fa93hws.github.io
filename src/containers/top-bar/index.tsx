import React, { useState } from 'react';

import { useIsLeftNavShown } from '@/containers/nav-left/is-shown';
import icons from '@/assets/styles/icon-font.css';
import { useResize, useScroll } from '@/utils/hooks/dom-listener';
import styles from './style.less';
import { useTopBarTitle } from './use-title';

export default function TopNav() {
  // when vertical scroll bar appear, the right icon need larger margin-right
  const [hasVBar, setHasVBar] = useState(false);
  // when title is shown, display the box shadow as well
  const [titleShown, setTitleShown] = useState(false);
  const [title, setTitle] = useTopBarTitle();
  const [isLeftNavShown, setIsLeftNavShown] = useIsLeftNavShown();

  useResize(() => {
    const html = document.getElementsByTagName('html')[0];
    setHasVBar(html.scrollHeight > html.clientHeight);
  });

  useScroll(() => {
    setTitleShown(window.scrollY > 90);
  });

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
