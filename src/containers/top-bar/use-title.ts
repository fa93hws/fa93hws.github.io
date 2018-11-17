import { useState, useEffect } from "react";

import MessageChannel from '@/utils/message-channel';

const channel = new MessageChannel();
const eventName = 'setTopBarTitle';
let topBarTitle = '';

function setTopBarTitle(val: string) {
  channel.publish(eventName, val);
}

export function useTopBarTitle(): [string, (val: string) => void] {
  const [title, setTitle] = useState(topBarTitle);

  useEffect(() => {
    channel.subscribe(eventName, setTitle);
    return () => {
      channel.unsubscribe(eventName, setTitle);
    }
  }, []);

  return [title, setTopBarTitle];
}
