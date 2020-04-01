
// outsource dependencies
import _ from 'lodash';
import { toastr } from 'react-redux-toastr';
import { fork, takeEvery, cancel, select, call, put, delay } from 'redux-saga/effects';

// local dependencies
import MENU from '../menu';
import appController from '../../controller';
import { TYPE, setMetaAction, selector as layoutSelector } from './reducer';

function * initializeSaga () {
  try {
    const { user } = yield select(appController.selector);
    console.log('%c LAYOUT initializeSaga ', 'color: #FF6766; font-weight: bolder; font-size: 12px;'
      , '\n user:', user
      , '\n menu size:', _.size(MENU)
    );
    // NOTE probably we should prepare menu some hov before show it to user
    yield put(setMetaAction({ menu: MENU }));
    throw new Error('Not implemented yet !!!');
  } catch ({ message }) {
    // FIXME do not know why but toastr does not appear without delay in case updating process of Layout component
    yield delay(0.5 * 1000);
    yield call(toastr.error, 'Error: Layout initialize', message);
  }

  yield put(setMetaAction({ initialized: true }));
}

function * submitSearchFormSaga ({ type, ...formData }) {
  try {
    console.log('%c LAYOUT submitSearchFormSaga ', 'color: #FF6766; font-weight: bolder; font-size: 12px;'
      , '\n formData:', formData
    );
    throw new Error('Not implemented yet !!!');
  } catch ({ message }) {
    yield call(toastr.error, 'Error: Layout submit search', message);
  }
  // NOTE hide form & clear value
  yield put(setMetaAction({ showSearch: false, searchInput: '' }));
}

function * toggleAsideSaga () {
  const { expanded } = yield select(layoutSelector);
  yield put(setMetaAction({ expanded: !expanded }));
}

/**
 * connect page sagas
 *
 * @private
 */
function * activityTasks () {
  yield takeEvery(TYPE.INITIALIZE, initializeSaga);
  yield takeEvery(TYPE.TOGGLE_ASIDE, toggleAsideSaga);
  yield takeEvery(TYPE.SUBMIT_SEARCH_FORM, submitSearchFormSaga);
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
