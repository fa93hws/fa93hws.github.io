import { useEffect } from 'react';

export default function useResize(listener: () => any, dep: any[] = []) {
  useEffect(() => {
    listener();
    window.addEventListener('resize', listener);
    return () => {
      window.removeEventListener('resize', listener);
    }
  }, dep);
}