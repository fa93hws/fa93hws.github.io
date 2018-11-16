import React from 'react';
import { observer } from 'mobx-react';

import icons from '@/assets/styles/icon-font.css';
import { leftNavStore } from '@/store';
import styles from './style.less';

function TopNav() {
  const { isShown: isLeftNavShown, toggleShown } = leftNavStore;

  const leftIconClasses = [styles.icon, styles.iconLeft];
  if (isLeftNavShown)
    leftIconClasses.push(icons.iconCross);
  else
    leftIconClasses.push(icons.iconMenu);

  return (
    <div className={styles.top}>
      <i className={leftIconClasses.join(' ')} onClick={toggleShown}/>
      <i className={[icons.iconShare2, styles.icon, styles.iconShare].join(' ')} />
    </div>
  );
}

export default observer(TopNav);