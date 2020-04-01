
// outsource dependencies
import { toastr } from 'react-redux-toastr';
import { takeEvery, put, call } from 'redux-saga/effects';

// local dependencies
import { getSelfExecutor } from '../../controller';
import { WELCOME_SCREEN } from '../../constants/routes';
import { prepareController } from '../../services/controller';
import { instanceAPI, instancePUB } from '../../services/request.service';

// configure
const initial = {
  disabled: false,
  initialValues: {},
  initialized: false,
  errorMessage: null,
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
    const session = yield call(instancePUB, { data: payload, method: 'POST', url: '/auth/token' });
    yield call(instanceAPI.setupSession, session);
    yield call(getSelfExecutor);
    yield put(WELCOME_SCREEN.ACTION_PUSH());
    yield call(toastr.success, 'Welcome', 'We pleasure to see you');
  } catch ({ message }) {
    yield call(toastr.error, 'Error', message);
    yield call(instanceAPI.setupSession, null);
    yield put(controller.action.updateCtrl({ errorMessage: message }));
  }
  yield put(controller.action.updateCtrl({ disabled: false }));
}
