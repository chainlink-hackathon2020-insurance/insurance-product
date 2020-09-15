import { combineReducers } from 'redux'
import { routerReducer } from 'react-router-redux'
import { drizzleReducers } from '@drizzle/store'

const reducer = combineReducers({
  routing: routerReducer,
  ...drizzleReducers
})

export default reducer
