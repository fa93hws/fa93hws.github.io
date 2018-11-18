import { useState, useEffect } from "react";

import bindthis from './decorators/bindthis';
import MessageChannel from './message-channel';


export default class Store {
  private channel = new MessageChannel();
  private state: Map<string, any> = new Map();

  @bindthis private toEventName(name: string) {
    return `set_${name}`;
  }

  @bindthis public useState<T>(name: string, initialVal?: T): [T, (val: T) => void] {
    if (this.state.has(name))
      initialVal = this.state.get(name);
    else
      this.state.set(name, initialVal);
    const [individualState, _setIndividualState] = useState(initialVal);

    useEffect(() => {
      this.channel.subscribe(this.toEventName(name), _setIndividualState);
      return () => {
        this.channel.unsubscribe(this.toEventName(name), _setIndividualState);
      }
    }, []);

    const setIndividualState = (value: T) => {
      // console.log(this, name, value);
      this.state.set(name, value);
      this.channel.publish(this.toEventName(name), value);
    }

    return [individualState, setIndividualState];
  }
}
