import React from 'react';
import { Link } from 'react-router-dom';

import icons from '@/assets/styles/icon-font.css';
import Store from '@/utils/shared-state';
import styles from './style.less';

export const leftNavStore = new Store();
leftNavStore.createState('display', true);

interface IIconName {
  home: string;
  archives: string;
  tags: string;
  github: string;
  weibo: string
}
const iconNameDict: IIconName = {
  'home': icons.iconHome3,
  'archives': icons.iconArchive,
  'tags': icons.iconPriceTags,
  'github': icons.iconGithub,
  'weibo': icons.iconSinaWeibo
};

function NavItem({ to , field }: { to: string, field: keyof IIconName }) {
  const name = field[0].toUpperCase() + field.slice(1);

  return (
    <li className={styles.navListItem}>
    {
      field === 'github' || field === 'weibo' ?
      (
        <a className={styles.navMenu} href={to} target="_blank">
          <i className={iconNameDict[field] + ' ' + styles.icon} />
          <span>{name}</span>
        </a>
      ): 
      (
        <Link className={styles.navMenu} to={to}>
          <i className={iconNameDict[field] + ' ' + styles.icon} />
          <span>{name}</span>
        </Link>
      )
    }
    </li>
  );
}

export default function LeftNav() {
  const [isLeftNavShown] = leftNavStore.useState<boolean>('display');

  let wrapperClass = styles.left;
  if (!isLeftNavShown)
    wrapperClass += ' ' + styles.close;
    
  return (
    <aside className={wrapperClass}>
      <div className={styles.sourceCode}>
        <a
          className="db"
          target="_blank"
          href="https://github.com/fa93hws/fa93hws.github.io"
        >
          源代码
        </a>
      </div>
      <div className={styles.author}>
        <Link to='/' className="db">
          <img className={styles.avatar} src="https://avatars0.githubusercontent.com/u/10626756?v=4"/>
        </Link>
        <p className={styles.name}>夏目天子</p>
        <p className={styles.email}>wjun0912@gmail.com</p>
      </div>
      <nav className={styles.nav}>
        <ul>
          <NavItem field="home" to="/" />
          <NavItem field="archives" to="/" />
          <NavItem field="tags" to="/" />
          <NavItem field="github" to="https://github.com/fa93hws" />
          <NavItem field="weibo" to="https://www.weibo.com/hinanawi" />
        </ul>
      </nav>
    </aside>
  );
}
