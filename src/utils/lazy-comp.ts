// Factory method to generate lazy component with ajax
import { lazy, ComponentType, LazyExoticComponent } from 'react';

export function emptyComponent<T> (): LazyExoticComponent<ComponentType<{}>>  {
  return lazy(function() {
    return new Promise((resolve, reject) => {
      resolve({
        'default': () => null
      })
    });
  });
}

export default function lazyComponentFactory<T> (
  dataPromise: Promise<T>,
  component: (props: { data: T }) => JSX.Element
): LazyExoticComponent<ComponentType<{}>> {
  return lazy(function(): Promise<{default: ComponentType<{}>}> {
    return new Promise((resolve, reject) => {
      dataPromise.then(data => {
        resolve({
          'default': function() {
            return component({
              data
            });
          }
        });
      }).catch(reject);
    });
  });
}