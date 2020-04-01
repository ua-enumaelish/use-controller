
// outsource dependencies
import { toastr } from 'react-redux-toastr';
import { takeEvery, put, call, delay } from 'redux-saga/effects';

// local dependencies
import { SIGN_IN } from '../../constants/routes';
import { instancePUB } from '../../services/request.service';
import { prepareController } from '../../services/controller';

// configure
const initial = {
  disabled: false,
  initialized: false,
  errorMessage: null,
  token: null,
  isTokenValid: false,
};

export const controller = prepareController({
  initial,
  prefix: 'sign-in',
  types: ['INITIALIZE', 'UPDATE_DATA'],
  subscriber: function * () {
    yield takeEvery(controller.TYPE.INITIALIZE, initializeSaga);
    yield takeEvery(controller.TYPE.UPDATE_DATA, updateDataSaga);
  }
});
export default controller;

function * initializeSaga ({ type, payload }) {
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n payload:', payload
  );
  let isTokenValid;
  try {
    yield call(instancePUB, { method: 'POST', url: '/auth/token/forgot-password/exists', data: payload });
    isTokenValid = true;
  } catch ({ message }) {
    isTokenValid = false;
  }
  // NOTE do nothing
  yield put(controller.action.updateCtrl({ initialized: true, isTokenValid, ...payload }));
}

function * updateDataSaga ({ type, payload }) {
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n payload:', payload
  );
  yield put(controller.action.updateCtrl({ disabled: true, errorMessage: null }));
  try {
    // TODO implement
    yield call(instancePUB, { method: 'POST', url: '/auth/token/change-password', data: payload });
    yield call(toastr.success, 'Change password', 'Password was successfully changed');
    yield delay(3 * 1000);
    yield put(SIGN_IN.ACTION_PUSH());
  } catch ({ message }) {
    yield call(toastr.error, 'Error', message);
    yield put(controller.action.updateCtrl({ errorMessage: message }));
  }
  yield put(controller.action.updateCtrl({ disabled: false }));
}
