
// outsource dependencies
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';

// local dependencies
import Layout from './layout';
import Welcome from './welcome';
import NoMatch from '../no-match';
import { config } from '../constants';
import * as ROUTES from '../constants/routes';

export class PrivatePages extends PureComponent {
    static propTypes = {
      auth: PropTypes.bool.isRequired,
      location: PropTypes.object.isRequired,
    };

    render () {
      const { location, auth } = this.props;
      // NOTE redirect for unauthorized users
      return !auth
        ? <Redirect to={{ pathname: ROUTES.SIGN_IN.ROUTE, state: { from: location } }}/>
        : <Layout>
          <Switch>
            <Route path={ROUTES.WELCOME_SCREEN.ROUTE} component={Welcome} />
            {/* OTHERWISE */}
            { config.DEBUG
              ? <Route component={NoMatch} />
              : <Redirect to={{ pathname: ROUTES.WELCOME_SCREEN.LINK(), state: { from: location } }}/>
            }
          </Switch>
        </Layout>;
    }
}

export default connect(
  state => ({ auth: false }),
  null
)(PrivatePages);
