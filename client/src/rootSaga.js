import { all, fork } from 'redux-saga/effects'
import { drizzleSagas } from '@drizzle/store'

export default function* root() {
  yield all(
    drizzleSagas.map(saga => fork(saga))
  )
}