
// outsource dependencies
import { toastr } from 'react-redux-toastr';
import { takeEvery, put, call } from 'redux-saga/effects';

// local dependencies
import { SIGN_IN } from '../../constants/routes';
import { instancePUB } from '../../services/request.service';
import { prepareController } from '../../services/controller';

// configure
const initial = {
  disabled: false,
  initialValues: {},
  initialized: false,
  errorMessage: null,
};

export const controller = prepareController({
  initial,
  prefix: 'forgot-password',
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
  // NOTE do nothing
  yield put(controller.action.updateCtrl({ initialized: true }));
}

function * updateDataSaga ({ type, payload }) {
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n payload:', payload
  );
  yield put(controller.action.updateCtrl({ disabled: true, errorMessage: null }));
  try {
    // TODO implement
    yield call(instancePUB, { method: 'POST', url: '/auth/token/forgot-password', payload });
    yield call(toastr.success, 'Reset password', 'Please check your email.');
    yield put(SIGN_IN.ACTION_PUSH());
  } catch ({ message }) {
    yield call(toastr.error, 'Error', message);
    yield put(controller.action.updateCtrl({ errorMessage: message }));
  }
  yield put(controller.action.updateCtrl({ disabled: false }));
}
