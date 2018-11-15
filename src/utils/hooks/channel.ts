import MessageChannel, { CallBackType } from '../message-channel';
import { useEffect } from 'react';

import { EventNamesType } from '../message-channel';

export const channel = new MessageChannel();

function useSubscription(name: EventNamesType, callback: CallBackType, dep: any[] = []) {
  useEffect(() => {
    channel.subscribe(name, callback);
    return () => {
      channel.unsubscribe(name, callback);
    }
  }, dep);
}

export default useSubscription;