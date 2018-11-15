import React, { Suspense, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

import lazyComponentFactory from '@/utils/lazy-comp';
import useSubscription from '@/utils/hooks/channel';
import icons from '@/assets/styles/icon-font.css';
import { IPerson } from '@/models/person';
import ErrorBoundary from '@/components/error-boundary';
import { LoadingSpinner } from '@/container/page-loading';
import dataResolver from './api';
import styles from './style.less';


const iconNameDict: any = {
  'home': icons.iconHome3,
  'archives': icons.iconArchive,
  'tags': icons.iconPriceTags,
  'github': icons.iconGithub,
  'weibo': icons.iconSinaWeibo
}

// const SwitcherIcon = ({
//   handleToggle,
//   isShown
// }: {
//   handleToggle: () => void,
//   isShown: boolean
// }) => (
//   <div
//     className={`${styles.theSwitch} ${isShown ? '' : styles.off}`}
//     onClick={handleToggle}
//   >
//     <i className={isShown ? icons.iconCross : icons.iconMenu} />
//   </div>
// );

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

function LeftNav({ data }: { data: IPerson }) {
  return (
    <React.Fragment>
      <div className={styles.author}>
        <Link to='/' className="db">
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
}

const Fetcher = lazyComponentFactory(dataResolver, LeftNav);

function Wrapper() {
  const [isShown, setIsShown] = useState(true);
  useSubscription('left-nav-change', setIsShown);

  const wrapperClassName = useMemo(() => {
    let className = styles.left;
    if (!isShown)
      className += ' ' + styles.close;
    return className;
  }, [isShown]);

  return (
    <aside className={wrapperClassName}>
      <ErrorBoundary>
        <Suspense fallback={<LoadingSpinner />}>
          <Fetcher />
        </Suspense>
      </ErrorBoundary>
    </aside>
  );
}
export default Wrapper;