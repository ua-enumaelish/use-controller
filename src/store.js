
// outsource dependencies
import { reducer as form } from 'redux-form';
import createSagaMiddleware from 'redux-saga';
import { reducer as toastr } from 'react-redux-toastr';
import { createBrowserHistory as createHistory } from 'history';
import { createStore, applyMiddleware, compose, combineReducers } from 'redux';
import { push, connectRouter, routerMiddleware as createRouterMiddleware } from 'connected-react-router';

// local dependencies
import config from './constants';
import { reducer as modal } from './components/redux-modal';
import { reducer as controller, sagas } from './services/controller';

// export history outside of components to be able dispatch navigation actions from anywhere!
export const history = createHistory();

// Build the middleware for intercepting and dispatching navigation actions
const routerMiddleware = createRouterMiddleware(history);

// Build the middleware to run our Saga
const sagaMiddleware = createSagaMiddleware();

// Apply redux extension compose for non production environment
const enchantedCompose = config.production ? compose : (window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose);

// Create store outside of root to be able dispatch actions from anywhere!
export const store = createStore(
  combineReducers({
    controller,
    toastr,
    modal,
    form,
    router: connectRouter(history)
  }),
  enchantedCompose(applyMiddleware(routerMiddleware, sagaMiddleware))
);

// initialize application sagas
sagaMiddleware.run(sagas);

// Export
export default store;

/**
 * provide functionality to change history outside of component
 *
 * @param {String} path
 * @public
 */
export function historyPush (path) {
  store.dispatch(push(path));
}
