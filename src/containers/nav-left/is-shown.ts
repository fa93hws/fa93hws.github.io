import { useState, useEffect } from "react";

import MessageChannel from '@/utils/message-channel';

const channel = new MessageChannel();
const eventName = 'setIsLeftNavShown';
let isLeftNavShown = true;

function setIsLeftNavShown(val: boolean) {
  channel.publish(eventName, val);
}

export function useIsLeftNavShown(): [boolean, (val: boolean) => void] {
  const [isShown, setIsShown] = useState(isLeftNavShown);

  useEffect(() => {
    channel.subscribe(eventName, setIsShown);
    return () => {
      channel.unsubscribe(eventName, setIsShown);
    }
  }, []);

  return [isShown, setIsLeftNavShown];
}