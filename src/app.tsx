import { observer } from 'mobx-react';
import React, { Fragment } from 'react';
import { Switch, Route, Redirect, withRouter, RouteComponentProps } from 'react-router-dom';
import Loadable from 'react-loadable';
import 'normalize.css';

import LeftNav from './containers/nav-left';
import TopBar from './containers/top-bar';
import PageLoading from './containers/page-loading';
import NotFound from './containers/not-found';
import { leftNavStore } from './store';
import './assets/styles/site.less';
import './assets/styles/icon-font.css';


const HomePage = Loadable({
  loader: () => import(/* webpackChunkName: "home" */'./containers/home'),
  loading: PageLoading
});
const BlogPage = Loadable({
  loader: () => import(/* webpackChunkName: "blog" */'./containers/blog'),
  loading: PageLoading
});

@observer
class App extends React.Component<RouteComponentProps> {
  public componentWillReceiveProps() {
    window.scrollTo(0, 0);
  };

  private get mainClass() {
    const { isShown } = leftNavStore;
    let out = 'main__container';
    if (isShown === false) out += ' expand';
    return out;
  }

  public render() {
    return (
      <Fragment>
        <LeftNav />
        <div className={this.mainClass}>
          <TopBar />
          <Switch>
            <Route path="/" exact={true} component={HomePage} />
            <Route path="/blog/:blogId" exact={true} component={BlogPage} />
            <Route path="/404" component={NotFound} />
            <Redirect to="/404" />
          </Switch>
        </div>
      </Fragment>
    );
  }
}

export default withRouter(App);
