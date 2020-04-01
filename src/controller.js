
// outsource dependencies
import { takeEvery, put, call, delay } from 'redux-saga/effects';

// local dependencies
import { store } from './store';
import { prepareController } from './services/controller';
import { instanceAPI, instancePUB } from './services/request.service';

// configure
instanceAPI.onAuthFailApplicationAction = () => store.dispatch(controller.action.initialize());

const initial = {
  initialized: false, // prevent redirect from page and show instead current page and it behavior - global preloader
  health: true,       // prevent redirect from page and show instead current page and it behavior - maintenance page
  user: null,         // logged user information
};

export const controller = prepareController({
  initial,
  prefix: 'app',
  types: ['INITIALIZE', 'SIGN_OUT', 'GET_SELF'],
  subscriber: function * () {
    yield takeEvery(controller.TYPE.GET_SELF, getSelfSaga);
    yield takeEvery(controller.TYPE.SIGN_OUT, signOutSaga);
    yield takeEvery(controller.TYPE.INITIALIZE, initializeSaga);
  }
});
export default controller;

function * initializeSaga ({ type, payload }) {
  // yield put(controller.action.clearCtrl());
  // console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
  //     , '\n payload:', payload
  // );
  // NOTE check health of API
  try {
    const { status } = { status: 'UP', instancePUB };
    // const { status } = yield call(instancePUB, { method: 'GET', url: '/actuator/health' });
    // NOTE API may answer "DOWN" (not ready yet)
    if (status !== 'UP') { throw new Error('API down for maintenance'); }
    yield put(controller.action.updateCtrl({ health: true }));
  } catch ({ message }) {
    yield put(controller.action.updateCtrl({ health: false }));
    // NOTE try again another time
    yield delay(10 * 1000);
    yield put(controller.action.initialize());
    return;
  }
  // NOTE try to restore user auth
  try {
    const hasSession = yield call(instanceAPI.restoreSessionFromStore);
    if (hasSession) { yield call(getSelfExecutor); }
  } catch ({ message }) {
    yield call(signOutSaga, {});
  }
  // NOTE initialization done
  yield put(controller.action.updateCtrl({ initialized: true }));
}

function * signOutSaga ({ type, payload }) {
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n payload:', payload
  );
  try {
    yield call(instanceAPI, { method: 'POST', url: '/auth/logout' });
  } catch ({ message }) {
    // NOTE do nothing
  }
  // NOTE clear client side session from store
  yield call(instanceAPI.setupSession, null);
  yield put(controller.action.updateCtrl({ user: null }));
}

function * getSelfSaga ({ type, payload }) {
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n payload:', payload
  );
  try {
    yield call(getSelfExecutor);
  } catch ({ message }) {
    // NOTE do nothing
    yield call(signOutSaga, {});
  }
}
export function * getSelfExecutor () {
  // const user = { name: 'I am a fake user data' };
  const user = yield call(instanceAPI, { method: 'GET', url: 'auth/users/me' });
  yield put(controller.action.updateCtrl({ user }));
}
