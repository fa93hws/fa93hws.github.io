import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import 'normalize.css';

import LeftNav from './container/nav';
import PageLoading from './container/page-loading';
import './assets/styles/site.less';
import './assets/styles/icon-font.css';

const HomePage = Loadable({
  loader: () => import(/* webpackChunkName: "home" */'./container/home'),
  loading: PageLoading
})


export default function App() {
  return (
    <Fragment>
      <LeftNav />
      <Switch>
        <Route path="/" exact={true} component={HomePage} />
      </Switch>
    </Fragment>
  );
}