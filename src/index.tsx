import 'babel-polyfill';
import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { render } from 'react-dom';

import App from './app';

const container = document.getElementById('root');
render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  container
);

let module: {
  hot: any
};
if (module !== undefined && module.hot) {
  module.hot.accept()
}