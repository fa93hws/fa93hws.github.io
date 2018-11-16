import React, { Fragment } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import Loadable from 'react-loadable';
import 'normalize.css';

import LeftNav from './containers/nav-left';
import PageLoading from './containers/page-loading';
import NotFound from './containers/not-found';
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


export default function App() {
  // const [isLeftNavShown, setIsLeftNavShown] = useState(true);

  // function toggleLeftNavShown() {
  //   setIsLeftNavShown(!isLeftNavShown);
  // }

  return (
    <Fragment>
      <LeftNav />
      {/* <div className="main__container"> */}
        {/* <TopNav
          isLeftNavShown={isLeftNavShown}
          handleToggle={toggleLeftNavShown}
          title="123"
        /> */}
        <Switch>
          <Route path="/" exact={true} component={HomePage} />
          <Route path="/blog/:blogId" exact={true} component={BlogPage} />
          <Route path="/404" component={NotFound} />
          <Redirect to="/404" />
        </Switch>
      {/* </div> */}
    </Fragment>
  );
}