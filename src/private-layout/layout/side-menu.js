
// outsource dependencies
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { Badge, ListGroup, ListGroupItem, Collapse, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

// local dependencies
import Fa from '../../components/fa-icon';
import { selector as layoutSelector, setMetaAction } from './reducer';

// configure
const preventDefault = e => e.preventDefault();
const stopPropagation = e => e.stopPropagation();
const InvalidType = () => <ListGroupItem className="nav-item text-danger"> Invalid type </ListGroupItem>;
const defaultIsActive = (location, link) => (!link ? false : (new RegExp(link, 'i')).test(location.pathname));
// Spec available menu item types
export const MENU_ITEM_TYPE = {
  ACTION: 'ACTION',
  HEADER: 'HEADER',
  LINK: 'LINK',
  MENU: 'MENU',
};

/**
 * Menu parent
 */
class SideMenu extends PureComponent {
    static propTypes = {
      expanded: PropTypes.bool.isRequired,
      location: PropTypes.object.isRequired,
      menu: PropTypes.arrayOf(PropTypes.object).isRequired,
    };

    render () {
      const { menu, expanded, location } = this.props;
      return <aside id="menu">
        <nav className="hide-scroll-bar nav-custom">
          <ListGroup flush>
            { (menu || []).map(item => <ItemByType
              {...item}
              id={item.key}
              key={item.key}
              expanded={expanded}
              location={location}
            />) }
          </ListGroup>
        </nav>
      </aside>;
    }
}
export default withRouter(connect(
  state => ({
    menu: layoutSelector(state).menu,
    expanded: layoutSelector(state).expanded,
  }),
  null
)(SideMenu));

/**
 * Switch items by type
 */
class ItemByType extends PureComponent {
    static propTypes = {
      type: PropTypes.oneOf(Object.keys(MENU_ITEM_TYPE).map(key => MENU_ITEM_TYPE[key])).isRequired
    };

    render () {
      const { type, ...attr } = this.props;
      let Component;
      switch (type) {
        default:
          Component = InvalidType;
          break;
        case MENU_ITEM_TYPE.LINK:
          Component = ItemLink;
          break;
        case MENU_ITEM_TYPE.MENU:
          Component = ItemMenuConnected;
          break;
        case MENU_ITEM_TYPE.HEADER:
          Component = ItemHeader;
          break;
        case MENU_ITEM_TYPE.ACTION:
          Component = ItemAction;
          break;
      }
      return <Component {...attr} />;
    }
}

class ItemView extends PureComponent {
    static propTypes = {
      expanded: PropTypes.bool.isRequired,
      name: PropTypes.string.isRequired,
      icon: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
      badge: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    };

    static defaultProps = {
      badge: null,
      icon: null,
    };

    formatIcon () {
      const { name, icon, expanded } = this.props;
      const className = `nav-item-icon animated slideInLeft ${expanded ? '' : 'collapsed'}`;
      return !icon ? null : <Fa
        tag="span"
        icon={icon}
        title={name}
        key="nav-item-icon"
        className={className}
      />;
    }

    formatBadge () {
      const { badge, expanded } = this.props;
      const className = `nav-item-badge animated slideInRight ${expanded ? '' : 'collapsed'}`;
      return !badge ? null : <Badge
        pill
        tag="div"
        color="success"
        key="nav-item-badge"
        className={className}
      > { badge } </Badge>;
    }

    formatTitle () {
      const { name, expanded } = this.props;
      const className = `nav-item-title animated zoomIn ${expanded ? '' : 'collapsed'}`;
      return !name ? null : <div key="nav-item-title" className={className}> { name } </div>;
    }

    render = () => <>{ this.formatIcon() }&nbsp;{ this.formatTitle() }&nbsp;{ this.formatBadge() }</>;
}

// MENU_ITEM_TYPE.HEADER
class ItemHeader extends PureComponent {
    static propTypes = { ...ItemView.propTypes };

    static defaultProps = { ...ItemView.defaultProps };

    render = () => <ListGroupItem className="nav-item nav-header">
      <ItemView {...this.props} />
    </ListGroupItem>;
}

// MENU_ITEM_TYPE.ACTION
class ItemAction extends PureComponent {
    static propTypes = {
      ...ItemView.propTypes,
      disabled: PropTypes.bool,
      isActive: PropTypes.func,
      action: PropTypes.func.isRequired,
      location: PropTypes.object.isRequired,
    };

    static defaultProps = {
      ...ItemView.defaultProps,
      disabled: false,
      isActive: defaultIsActive,
    };

    isActive = () => {
      const { isActive, location } = this.props;
      if (_.isFunction(isActive)) {
        return isActive(location, null);
      }
    };

    handleClick = () => {
      const { action } = this.props;
      if (_.isFunction(action)) {
        return action(this.props);
      }
      console.error('Action was not be setup', this.props);
    };

    render () {
      const { disabled, ...attr } = this.props;
      return <ListGroupItem
        className="nav-item nav-action"
        disabled={disabled}
        active={this.isActive()}
        onClick={this.handleClick}
      >
        <a href="/" className="text-truncate" onClick={preventDefault}>
          <ItemView {...attr} />
        </a>
      </ListGroupItem>;
    }
}

// MENU_ITEM_TYPE.LINK
class ItemLink extends PureComponent {
    static propTypes = {
      ...ItemView.propTypes,
      disabled: PropTypes.bool,
      isActive: PropTypes.func,
      link: PropTypes.string.isRequired,
      location: PropTypes.object.isRequired,
    };

    static defaultProps = {
      ...ItemView.defaultProps,
      disabled: false,
      isActive: defaultIsActive,
    };

    isActive = () => {
      const { isActive, location, link } = this.props;
      if (_.isFunction(isActive)) {
        return isActive(location, link);
      }
    };

    render () {
      const { disabled, link, ...attr } = this.props;
      return <ListGroupItem disabled={disabled} className="nav-item nav-link" active={this.isActive()}>
        <Link to={link}> <ItemView {...attr} /> </Link>
      </ListGroupItem>;
    }
}

// MENU_ITEM_TYPE.MENU
class ItemMenu extends PureComponent {
    static propTypes = {
      ...ItemView.propTypes,
      disabled: PropTypes.bool,
      isActive: PropTypes.func,
      update: PropTypes.func.isRequired,
      list: PropTypes.array.isRequired,
      location: PropTypes.object.isRequired,
      lastOpened: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
      id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    };

    static defaultProps = {
      ...ItemView.defaultProps,
      lastOpened: null,
      disabled: false,
      isActive: null,
    };

    constructor (...args) {
      super(...args);
      this.state = { open: false, animationClass: '' };
    }

    onExiting = () => this.setState({ animationClass: 'zoomOut' });

    onEntering = () => this.setState({ animationClass: 'zoomIn' });

    handleClick = e => {
      e.preventDefault();
      const { update, id } = this.props;
      !this.state.open && update(id);
      this.setState({ open: !this.state.open });
    };

    isActive = () => {
      const { name, list, location } = this.props;
      // NOTE may be defined specific for menu
      const active = (_.isFunction(this.props.isActive) ? this.props.isActive : () => false)(location, name);
      // NOTE at least one nested item should be active to activate menu
      return active ? true : !list
        .every(({ isActive, link }) => !(_.isFunction(isActive) ? isActive : defaultIsActive)(location, link));
    };

    componentDidMount = () => this.props.expanded && this.isActive() && this.setState({ open: true });

    componentDidUpdate (prevProps) {
      const { expanded, lastOpened, id } = this.props;
      if (expanded) {
        if (!this.isActive() && id !== lastOpened) {
          this.setState({ open: false });
        }
      } else if (prevProps.expanded) {
        this.setState({ open: false });
      }
    }

    renderCollapsible () {
      const { open, animationClass } = this.state;
      const { disabled, list, location, ...attr } = this.props;
      return <ListGroupItem
        disabled={disabled}
        active={this.isActive()}
        onClick={this.handleClick}
        className="nav-item nav-menu"
      >
        <a href="/" className="nav-menu-toggle" onClick={preventDefault}>
          <ItemView {...attr} />
        </a>
        <Collapse
          isOpen={open}
          onClick={stopPropagation}
          onExiting={this.onExiting}
          onEntering={this.onEntering}
        >
          <ListGroup
            className={`animated ${animationClass}`}
            style={{ animationDuration: '500ms' }}
          >
            { (list || []).map(item => <ItemByType
              key={item.id}
              {...item}
              location={location}
              expanded={this.props.expanded}
            />) }
          </ListGroup>
        </Collapse>
      </ListGroupItem>;
    }

    onMouseEnter = () => this.setState({ open: true });

    onMouseLeave = () => this.setState({ open: false });

    getDropdownMenuPosition () {
      if (!this.dropdownRef) { return { top: 50, left: 70 }; }
      // NOTE make sure polyfill was added https://developer.mozilla.org/en-US/docs/Web/API/Element/getBoundingClientRect
      const { top, left, width } = this.dropdownRef.containerRef.current.getBoundingClientRect();
      // NOTE prevent distance between toggle and menu
      return { top, left: left + width - 4 };
    }

    getDropdownRef = ref => this.dropdownRef = ref;

    renderDropdown () {
      const { disabled, list, location, ...attr } = this.props;
      return <ListGroupItem
        disabled={disabled}
        active={this.isActive()}
        className="nav-item nav-menu"
      >
        <Dropdown
          isOpen={this.state.open}
          ref={this.getDropdownRef}
          toggle={this.handleClick}
          onMouseOver={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
        >
          <DropdownToggle tag="a" className="nav-menu-toggle">
            <ItemView {...attr} />
          </DropdownToggle>
          <DropdownMenu className="animated zoomInLeft" style={{
            position: 'fixed',
            animationDuration: '400ms',
            ...this.getDropdownMenuPosition()
          }}>
            <DropdownItem header> { this.props.name } </DropdownItem>
            <DropdownItem header>
              { (list || []).map(item => <ItemByType
                key={item.id}
                {...item}
                location={location}
                expanded={this.props.expanded}
              />) }
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      </ListGroupItem>;
    }

    render = () => (this.props.expanded ? this.renderCollapsible() : this.renderDropdown());
}

const ItemMenuConnected = connect(
  state => ({
    lastOpened: layoutSelector(state).lastOpened
  }),
  dispatch => ({
    update: id => dispatch(setMetaAction({ lastOpened: id }))
  }),
)(ItemMenu);
