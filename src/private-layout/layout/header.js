
// outsource dependencies
import _ from 'lodash';
import PropTypes from 'prop-types';
import { Button } from 'reactstrap';
import { Link } from 'react-router-dom';
import React, { PureComponent } from 'react';

// local dependencies
import { Logo } from '../../images';
import UserMenuConnected from './user-menu';
import SearchFormConnected from './search-form';
import { FasIcon } from '../../components/fa-icon';
import { WELCOME_SCREEN } from '../../constants/routes';

export class Header extends PureComponent {
    static propTypes = {
      expanded: PropTypes.bool.isRequired,
      openSearch: PropTypes.func.isRequired,
      toggleAside: PropTypes.func.isRequired,
    };

    handleResize = _.throttle(() => {
      const { expanded, toggleAside } = this.props;
      if (expanded && window.innerWidth < 768) {
        toggleAside();
      }
    }, 500, { trailing: true });

    componentDidMount () {
      this.handleResize();
      window.addEventListener('resize', this.handleResize);
    }

    componentWillUnmount = () => window.removeEventListener('resize', this.handleResize);

    render () {
      return <header id="header" className="topnavbar-wrapper">
        <nav className="navbar topnavbar">
          <div className="navbar-header">
            <Link className="navbar-brand" to={WELCOME_SCREEN.LINK()}>
              <div className="brand-logo">
                <Logo className="img-fluid mr-2" style={{ width: 35 }} />
                <span className="logo-text"> RAD Dummy </span>
              </div>
              <div className="brand-logo-collapsed">
                <Logo className="img-fluid" style={{ width: 40 }} />
              </div>
            </Link>
          </div>
          <ul className="navbar-nav mr-auto flex-row">
            <li className="nav-item">
              <Button size="xs" color="link" className="nav-link" onClick={this.props.toggleAside}>
                <FasIcon size="lg" icon="bars" />
              </Button>
            </li>
          </ul>
          <SearchFormConnected />
          <ul className="navbar-nav flex-row">
            <li className="nav-item">
              <Button size="xs" color="link" className="nav-link" onClick={this.props.openSearch}>
                <FasIcon size="lg" icon="search" />
              </Button>
            </li>
            <UserMenuConnected />
            {/*<li className="nav-item pr-3"> /!*empty item*!/ </li>*/}
          </ul>
        </nav>
      </header>;
    }
}

export default Header;
