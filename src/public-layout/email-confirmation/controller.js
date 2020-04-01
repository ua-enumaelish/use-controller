
// outsource dependencies
import { takeEvery, put, call } from 'redux-saga/effects';

// local dependencies
import { prepareController } from '../../services/controller';
import { instancePUB } from '../../services/request.service';

// configure
const initial = {
  disabled: false,
  initialized: false,
  errorMessage: null,
  isTokenValid: false,
};

export const controller = prepareController({
  initial,
  prefix: 'sign-in',
  types: ['INITIALIZE'],
  subscriber: function * () {
    yield takeEvery(controller.TYPE.INITIALIZE, initializeSaga);
  }
});
export default controller;

function * initializeSaga ({ type, payload }) {
  console.log(`%c ${type} `, 'color: #FF6766; font-weight: bolder; font-size: 12px;'
    , '\n payload:', payload
  );
  let isTokenValid;
  try {
    yield call(instancePUB, { method: 'POST', url: '/auth/token/confirmation', data: payload });
    isTokenValid = true;
  } catch ({ message }) {
    isTokenValid = false;
  }
  // NOTE do nothing
  yield put(controller.action.updateCtrl({ initialized: true, isTokenValid }));
}
