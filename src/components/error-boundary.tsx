import React from 'react';

interface IState {
  hasError: false;
}

export default class ErrorBoundary extends React.Component<{}, IState> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: any) {
    return { hasError: true };
  }

  componentDidCatch(error: any, info: any) {
    if (Array.isArray(error)) {
      for (let i = 0; i < error.length; i ++)
        if ('type' in error[i] && error[i].type === 'NOT_FOUND')
          return window.location.replace('/404');
    }
    // console.log(error, info);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}