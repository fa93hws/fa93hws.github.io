import { useEffect } from 'react';

function useListener(eventName: keyof WindowEventMap, listener: () => any, dep: any[] = []) {
  useEffect(() => {
    listener();
    window.addEventListener(eventName, listener, true);
    return () => {
      window.removeEventListener(eventName, listener, true);
    }
  }, dep);
}

export function useResize(listener: () => any, dep: any[] = []) {
  useListener('resize', listener, dep);
}

export function useScroll(listener: () => any, dep: any[] = []) {
  useListener('scroll', listener, dep);
}