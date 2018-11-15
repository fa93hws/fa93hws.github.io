import React, { useState } from 'react';

import icons from '@/assets/styles/icon-font.css';
import styles from './style.less';
import useSubscription, { channel } from '@/utils/hooks/channel';

export default function TopNav({ title }: { title: string; }) {
  const [isLeftNavShown, setIsLeftNavShown] = useState(true);
  useSubscription('left-nav-change', setIsLeftNavShown);

  const leftIconClasses = [styles.icon, styles.iconLeft];
  if (isLeftNavShown)
    leftIconClasses.push(icons.iconCross);
  else
    leftIconClasses.push(icons.iconMenu);

  function handleToggle() {
    channel.publish('left-nav-change', !isLeftNavShown);
  }

  return (
    <div className={styles.top}>
      <i className={leftIconClasses.join(' ')} onClick={handleToggle}/>
      <i className={[icons.iconShare2, styles.icon, styles.iconShare].join(' ')} />
    </div>
  );
}