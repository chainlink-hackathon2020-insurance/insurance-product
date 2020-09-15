import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router'
import { DrizzleProvider } from '@drizzle/react-plugin'

// Layouts
import App from './App'
import { LoadingContainer } from '@drizzle/react-components'

import { history, store } from './store'
import drizzleOptions from './drizzleOptions'
import {Provider} from "react-redux";

ReactDOM.render((
    <DrizzleProvider options={drizzleOptions} store={store}>
      <LoadingContainer>
          <Provider store={store}>
              <Router history={history} store={store}>
                <div>
                    <Route exact path="/" component={App} />
                    <Route exact path="/profile" component={App} />
                </div>
              </Router>
          </Provider>
      </LoadingContainer>
    </DrizzleProvider>
  ),
  document.getElementById('root')
);