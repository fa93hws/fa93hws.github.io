import bindthis from '@/utils/decorators/bindthis';

export type EventNamesType = 'left-nav-change' | 'top-nav-title-change';
export type CallBackType = (...args: any[]) => any;

export default class MessageChannel {
  private readonly events: { [eventName: string]: CallBackType[] } = {};

  @bindthis public publish(eventName: EventNamesType, ...args: any[]) {
    if (this.events[eventName] === undefined) return;
    this.events[eventName].forEach(c => {
      c(...args);
    });
  }

  @bindthis public subscribe(eventName: EventNamesType, callback: CallBackType) {
    if (this.events[eventName] === undefined)
      this.events[eventName] = [];
    this.events[eventName].push(callback);
  }

  @bindthis public unsubscribe(eventName: EventNamesType, callback: CallBackType) {
    if (this.events[eventName] === undefined) return;
    this.events[eventName] = this.events[eventName].filter(c => c !== callback);
  }
}
