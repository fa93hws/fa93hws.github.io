import React, { useState, useEffect } from 'react';
import { withRouter, RouteComponentProps } from 'react-router';

import { leftNavStore } from '@/containers/nav-left';
import icons from '@/assets/styles/icon-font.css';
import { useResize, useScroll } from '@/utils/hooks/dom-listener';
import Store from '@/utils/shared-state';
import styles from './style.less';

export const topBarStore = new Store();
topBarStore.createState('title', '');

function TopNav(props: RouteComponentProps) {
  // when vertical scroll bar appear, the right icon need larger margin-right
  const [hasVBar, setHasVBar] = useState(false);
  // when title is shown, display the box shadow as well
  const [titleShown, setTitleShown] = useState(false);
  const [title] = topBarStore.useState<string>('title');
  const [isLeftNavShown, setIsLeftNavShown] = leftNavStore.useState<boolean>('display');
  // hide share in 404 page
  const [hideShareFlag, setHideShareFlag] = useState(false);

  useResize(() => {
    const html = document.getElementsByTagName('html')[0];
    setHasVBar(html.scrollHeight > html.clientHeight);
  });

  useScroll(() => {
    setTitleShown(window.scrollY > 90);
  });

  useEffect(() => {
    if (props.location.pathname === '/404')
      setHideShareFlag(true);
    else
      setHideShareFlag(false);
  }, [props.location.pathname]);

  useEffect(() => {
    document.title = title;
  }, [title])
  
  // right icon class
  let rightIconClass = [icons.iconShare2, styles.icon, styles.iconShare].join(' ');
  if (hideShareFlag)
    rightIconClass += ' ' + styles.hide;
  else if (hasVBar)
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

export default withRouter(TopNav);