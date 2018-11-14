import React, { Suspense } from 'react';
import { Link } from 'react-router-dom';

import lazyComponentFactory from '@/utils/lazy-comp';
import icons from '@/assets/styles/icon-font.css';
import { IPerson } from '@/models/person';
import ErrorBoundary from '@/components/error-boundary';
import PageLoading from '@/container/page-loading';
import dataResolver from './api';
import styles from './style.less';

const iconNameDict: any = {
  'home': icons.iconHome3,
  'archives': icons.iconArchive,
  'tags': icons.iconPriceTags,
  'github': icons.iconGithub,
  'weibo': icons.iconSinaWeibo
}

function NavItem({ to , field }: { to: string, field: string }) {
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

const LeftNav = ({ data }: { data: IPerson}) => (
  <React.Fragment>
    <div className={styles.author}>
      <Link to='/'>
        <img className={styles.avatar} src={data.avatarUrl}/>
      </Link>
      <p className={styles.name}>{data.name}</p>
      <p className={styles.email}>{data.email}</p>
    </div>
    <nav className={styles.nav}>
      <ul>
        <NavItem field="home" to="/" />
        <NavItem field="archives" to="/" />
        <NavItem field="tags" to="/" />
        <NavItem field="github" to={data.url} />
        <NavItem field="weibo" to="https://www.weibo.com/hinanawi" />
      </ul>
    </nav>
  </React.Fragment>
);

const Fetcher = lazyComponentFactory<IPerson>(dataResolver, LeftNav);

const Wrapper = () => (
  <aside className={styles.left}>
    <ErrorBoundary>
      <Suspense fallback={<PageLoading />}>
        <Fetcher />
      </Suspense>
    </ErrorBoundary>
  </aside>
);

export default Wrapper;