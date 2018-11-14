import React, { Fragment } from 'react';
import { Switch, Route } from 'react-router-dom';
import Loadable from 'react-loadable';
import 'normalize.css';

import LeftNav from './container/nav';
import HomePage from './container/home';
import './assets/styles/site.less';
import './assets/styles/icon-font.css';


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