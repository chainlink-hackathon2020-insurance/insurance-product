import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router'
import { DrizzleProvider } from '@drizzle/react-plugin'

// Layouts
import App from './App'
import { LoadingContainer } from '@drizzle/react-components'

import { history, store } from './store'
import drizzleOptions from './drizzleOptions'
import { Provider } from "react-redux";
import { Drizzle, generateStore } from "@drizzle/store"; // fka: drizzle

// Setup drizzle
const drizzleStore = generateStore(drizzleOptions);
const drizzle = new Drizzle(drizzleOptions, drizzleStore);

ReactDOM.render((
  <DrizzleProvider options={drizzleOptions} store={store}>
    <LoadingContainer>
      <Provider store={store}>
        <Router history={history} store={store}>
          <div>
            <Route exact path="/" component={() => <App drizzle={drizzle} store={drizzleStore} />} />
            <Route exact path="/policy" component={() => <App drizzle={drizzle} store={drizzleStore} />} />
            <Route exact path="/profile" component={() => <App drizzle={drizzle} store={drizzleStore} />} />
            <Route exact path="/claims" component={() => <App drizzle={drizzle} store={drizzleStore} />} />
            <Route exact path="/about" component={() => <App drizzle={drizzle} store={drizzleStore} />} />
            <Route exact path="/contact" component={() => <App drizzle={drizzle} store={drizzleStore} />} />
          </div>
        </Router>
      </Provider>
    </LoadingContainer>
  </DrizzleProvider>
),
  document.getElementById('root')
);