import MessageChannel, { CallBackType } from '../message-channel';
import { useEffect } from 'react';

import { EventNamesType } from '../message-channel';

export const channel = new MessageChannel();

export const globalState = {
  isLeftNavShown: true,
  topNavTitle: ''
};

function updateGlobalState(name: EventNamesType, payload?: any) {
  switch(name) {
    case 'left-nav-change':
      globalState.isLeftNavShown = payload;
      break;
    case 'top-nav-title-change':
      globalState.topNavTitle = payload;
      break;
  }
}

function useSubscription(name: EventNamesType, callback: CallBackType, dep: any[] = []) {
  function proxy(...args: any[]) {
    callback(...args);
    updateGlobalState(name, ...args);
  }

  useEffect(() => {
    channel.subscribe(name, proxy);
    return () => {
      channel.unsubscribe(name, proxy);
    }
  }, dep);
}

export default useSubscription;