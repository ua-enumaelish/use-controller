
// outsource dependencies
import { fork } from 'redux-saga/effects';

// local dependencies
import { sagas as layoutSaga } from './layout/saga';
import { sagas as welcomeSaga } from './welcome/saga';

/**
 * connect all child sagas
 */
export function * sagas () {
  yield fork(layoutSaga);
  yield fork(welcomeSaga);
}

export default sagas;
