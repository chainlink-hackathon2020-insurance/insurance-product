import {createBrowserHistory} from 'history'
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import { routerMiddleware } from 'react-router-redux'
import reducer from './reducers/reducer'
import rootSaga from './rootSaga'
import createSagaMiddleware from 'redux-saga'
import drizzleOptions from './drizzleOptions'
import { generateContractsInitialState } from "@drizzle/store";

// Redux DevTools
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const history = createBrowserHistory()


const routingMiddleware = routerMiddleware(history)
const sagaMiddleware = createSagaMiddleware()

let initialState = {
  contracts: generateContractsInitialState(drizzleOptions)
}


const store = createStore(
  reducer,
  initialState,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      routingMiddleware,
      sagaMiddleware
    )
  )
)

sagaMiddleware.run(rootSaga)

export { history }
export { store }

export default store
