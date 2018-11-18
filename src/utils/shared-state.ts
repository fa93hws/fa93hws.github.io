import { useState, useEffect } from "react";

import bindthis from './decorators/bindthis';
import MessageChannel from './message-channel';


export default class Store {
  private channel = new MessageChannel();
  private state: Map<string, any> = new Map();

  @bindthis private toEventName(name: string) {
    return `set_${name}`;
  }

  @bindthis public createState<T>(name: string, initialVal: T): void {
    this.state.set(name, initialVal);
  }

  @bindthis public useState<T>(name: string): [T, (val: T) => void] {
    const eventName = this.toEventName(name);
    const [individualState, _setIndividualState] = useState(this.state.get(name));

    useEffect(() => {
      this.channel.subscribe(eventName, _setIndividualState);
      return () => {
        this.channel.unsubscribe(eventName, _setIndividualState);
      }
    }, []);

    const setIndividualState = (value: T) => {
      this.state.set(name, value);
      this.channel.publish(eventName, value);
    }

    return [individualState, setIndividualState];
  }
}
