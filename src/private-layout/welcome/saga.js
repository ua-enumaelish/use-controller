
// outsource dependencies
import { fork, takeEvery, cancel, select, put/*, call*/ } from 'redux-saga/effects';

// local dependencies
import { TYPE, setMetaAction } from './reducer';
import appController from '../../controller';

function * initializeSaga () {
  const { user } = yield select(appController.selector);
  console.log('%c WELCOME_SCREEN initialize ', 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n user:', user
  );
  yield put(setMetaAction({ initialized: true }));
}

/**
 * connect page sagas
 *
 * @private
 */
function * activityTasks () {
  yield takeEvery(TYPE.INITIALIZE, initializeSaga);
}

/**
 * define activity behavior
 * on component unmount we fire action CLEAR to bring reducer data to default and here
 * we renew all sagas to prevent executing actions which does not finish yet
 */
export function * sagas () {
  let activity = yield fork(activityTasks);
  yield takeEvery(TYPE.CLEAR, function * () {
    yield cancel(activity);
    activity = yield fork(activityTasks);
  });
}

export default sagas;
