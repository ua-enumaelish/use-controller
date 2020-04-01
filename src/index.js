
// outsource dependencies
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import ReduxToastr from 'react-redux-toastr';
import React, { memo, useEffect } from 'react';
import { Route, Switch, Redirect } from 'react-router';
import { ConnectedRouter } from 'connected-react-router';
// STYLES inject ...
import './style';
// polyfill
import './polyfill';
//
import registerServiceWorker from './registerServiceWorker';
// local dependencies
import { config } from './constants';
import { history, store } from './store';
import * as ROUTES from './constants/routes';
import { Modal as ImageCropModal } from './components/image-crop';

import controller from './controller';
import { useController } from './services/controller';

import NoMatch from './no-match';
import Maintenance from './maintenance';
import PublicLayout from './public-layout';
import PrivateLayout from './private-layout';
import Preloader from './components/preloader';

const App = memo(() => {
  // NOTE subscribe app controller
  const [{ initialized, health }, { initialize }, isControllerConnected] = useController(controller);
  // NOTE initialize business logic
  useEffect(() => { initialize(); }, [initialize]);
  // NOTE select view based on application state
  if (!health) { return <Maintenance />; }
  if (!initialized || !isControllerConnected) { return <Preloader active={true} />; }
  return <>
    <ConnectedRouter history={history} location={history.location}>
      <Switch>
        <Route path={ROUTES.LAYOUT_PUBLIC} component={PublicLayout} />
        <Route path={ROUTES.LAYOUT_PRIVATE} component={PrivateLayout} />
        { config.DEBUG
        // NOTE otherwise only for debug
          ? <Route component={NoMatch} />
          : <Redirect to={{ pathname: ROUTES.SIGN_IN.LINK(), state: { from: history.location } }}/>
        }
      </Switch>
    </ConnectedRouter>
    <ReduxToastr
      progressBar
      timeOut={2000}
      preventDuplicates
      newestOnTop={false}
      position="top-right"
      transitionIn="fadeIn"
      transitionOut="fadeOut"
    />
    <ImageCropModal />
  </>;
});

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
