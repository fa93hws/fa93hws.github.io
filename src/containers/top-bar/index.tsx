import React, { useState, useEffect } from 'react';

import icons from '@/assets/styles/icon-font.css';
import styles from './style.less';
import { withRouter, RouteComponentProps } from 'react-router';
import { useIsLeftNavShown } from '../nav-left/is-shown';

function TopNav(props: RouteComponentProps) {
  const [hasVBar, setHasVBar] = useState(false);
  const [isLeftNavShown, setIsLeftNavShown] = useIsLeftNavShown();

  useEffect(() => {
    if (props.location.pathname.slice(5) === '/blog')
      setIsLeftNavShown(false);
  }, [props.location.pathname])

  let leftIconClass = styles.icon;
  if (isLeftNavShown)
    leftIconClass += ' ' + icons.iconCross;
  else
    leftIconClass += ' ' + icons.iconMenu

  let wrapperClass = styles.top;
  wrapperClass += ' ' + styles.withShadow;

  return (
    <div className={wrapperClass}>
      <i
        className={leftIconClass}
        onClick={() => setIsLeftNavShown(!isLeftNavShown)}
      />
      <i className={[icons.iconShare2, styles.icon, styles.iconShare].join(' ')} />
    </div>
  );
}

export default withRouter(TopNav);