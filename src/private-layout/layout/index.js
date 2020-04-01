
// outsource dependencies
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';

// local dependencies
import Header from './header';
import SideMenu from './side-menu';
import appController from '../../controller';
import Preloader from '../../components/preloader';
import { selector as layoutSelector, toggleAsideAction, setMetaAction, initializeAction, clearAction } from './reducer';

class Layout extends PureComponent {
    static propTypes = {
      expanded: PropTypes.bool,
      init: PropTypes.func.isRequired,
      clear: PropTypes.func.isRequired,
      openSearch: PropTypes.func.isRequired,
      children: PropTypes.element.isRequired,
      toggleAside: PropTypes.func.isRequired,
      initialized: PropTypes.bool.isRequired,
    };

    static defaultProps = {
      expanded: false,
    };

    componentDidMount = () => this.props.init();

    componentWillUnmount = () => this.props.clear();

    render () {
      const { children, expanded, initialized } = this.props;
      return <Preloader active={!initialized}>
        <div id="privateLayout" className={expanded ? 'expanded' : 'collapsed'}>
          <Header
            expanded={expanded}
            openSearch={this.props.openSearch}
            toggleAside={this.props.toggleAside}
          />
          <SideMenu />
          <main id="content">
            <div className="hide-scroll-bar">
              { children }
            </div>
          </main>
        </div>
      </Preloader>;
    }
}

export default connect(
  state => ({
    user: appController.selector(state).user,
    expanded: layoutSelector(state).expanded,
    initialized: layoutSelector(state).initialized,
  }),
  dispatch => ({
    clear: () => dispatch(clearAction()),
    init: () => dispatch(initializeAction()),
    toggleAside: () => dispatch(toggleAsideAction()),
    openSearch: () => dispatch(setMetaAction({ showSearch: true })),
  })
)(Layout);
