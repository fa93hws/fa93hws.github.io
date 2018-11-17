import React from 'react';
import { observer, Observer } from 'mobx-react';

import icons from '@/assets/styles/icon-font.css';
import { leftNavStore } from '@/store';
import styles from './style.less';
import { withRouter, RouteComponentProps } from 'react-router';

interface IState {
  hasVScrollBar: boolean;
}


class TopNav extends React.Component<RouteComponentProps, IState> {
  constructor(props: RouteComponentProps) {
    super(props);
    this.state = {
      hasVScrollBar: false
    }
  }

  public componentDidUpdate(oldProps: RouteComponentProps) {
    const newPath = this.props.location.pathname;
    const oldPath = oldProps.location.pathname;
    if (
      leftNavStore.isShown === true &&
      oldPath !== newPath &&
      newPath.slice(5) === '/blog'
    )
      leftNavStore.toggleShown();
  }

  private get leftIconClass() {
    const { isShown } = leftNavStore;
    const leftIconClasses = [styles.icon];
    if (isShown)
      leftIconClasses.push(icons.iconCross);
    else
      leftIconClasses.push(icons.iconMenu);
    return leftIconClasses.join(' ');
  }
  private get wrapperClass() {
    const out = [styles.top];
    out.push(styles.withShadow);
    return out.join(' ');
  }

  public render() {
    const { toggleShown } = leftNavStore;
    return (
      <Observer>
      {
        () => (
          <div className={this.wrapperClass}>
            <i className={this.leftIconClass} onClick={toggleShown}/>
            <i className={[icons.iconShare2, styles.icon, styles.iconShare].join(' ')} />
          </div>
        )
      }
      </Observer>

    );
  }
}

export default withRouter(TopNav);