
// outsource dependencies
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import * as appIcons from '../images/app-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { library } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// NOTE development only !!!
library.add(fas);
library.add(fab);
library.add(far);

// NOTE custom icons which we inject in font awesome
library.add({ ...appIcons });

// NOTE production connected icons make sure in the repo wos not present development (unused) icons
// library.add(
//     fas.faEye,
// );
// library.add(
//     far.faBell,
// );
// library.add(
//     fab.faGoogle
// );
export default FontAwesomeIcon;

export class FasIcon extends PureComponent {
    static propTypes = { icon: PropTypes.string.isRequired };

    static defaultProps = { };

    render () {
      const { icon, ...attr } = this.props;
      return <FontAwesomeIcon icon={['fas', icon]} {...attr} />;
    }
}

export class FarIcon extends PureComponent {
    static propTypes = { ...FasIcon.propTypes };

    static defaultProps = { ...FasIcon.defaultProps };

    render () {
      const { icon, ...attr } = this.props;
      return <FontAwesomeIcon icon={['far', icon]} {...attr} />;
    }
}

export class FabIcon extends PureComponent {
    static propTypes = { ...FasIcon.propTypes };

    static defaultProps = { ...FasIcon.defaultProps };

    render () {
      const { icon, ...attr } = this.props;
      return <FontAwesomeIcon icon={['fab', icon]} {...attr} />;
    }
}

export class AppIcon extends PureComponent {
    static propTypes = { ...FasIcon.propTypes };

    static defaultProps = { ...FasIcon.defaultProps };

    render () {
      const { icon, ...attr } = this.props;
      return <FontAwesomeIcon icon={['app', icon]} {...attr} />;
    }
}

export class SortIcon extends PureComponent {
    static propTypes = {
      status: PropTypes.any,
      classMap: PropTypes.func,
      statusMap: PropTypes.func,
      faPrefix: PropTypes.string,
      className: PropTypes.string,
    };

    static defaultProps = {
      status: null,
      faPrefix: 'fas',
      className: '',
      statusMap: status => {
        switch (status) {
          default: return 'sort';
          case true: return 'sort-amount-up';
          case false: return 'sort-amount-down';
        }
      },
      classMap: (status, attr) => {
        switch (status) {
          default: return `ml-1 mr-1 text-thin ${attr.disabled ? 'text-muted' : 'text-gray'}`;
          case true: return `ml-1 mr-1 text-bold ${attr.disabled ? 'text-muted' : 'text-gray-d'}`;
          case false: return `ml-1 mr-1 text-bold ${attr.disabled ? 'text-muted' : 'text-gray-d'}`;
        }
      }
    };

    render () {
      const { className, faPrefix, classMap, statusMap, status, ...attr } = this.props;
      return <FontAwesomeIcon
        {...attr}
        icon={[faPrefix, statusMap(status, attr)]}
        className={`${className} ${classMap(status, attr)}`}
      />;
    }
}
