
// outsource dependencies
import _ from 'lodash';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { UncontrolledDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

// local dependencies
import { Avatar } from '../../images';
import { Humanize } from '../../components/filter';
import { FasIcon } from '../../components/fa-icon';

class UserMenu extends PureComponent {
    static propTypes = {
      roles: PropTypes.array.isRequired,
      user: PropTypes.object.isRequired,
      signOut: PropTypes.func.isRequired,
      expanded: PropTypes.bool.isRequired,
      toggleAside: PropTypes.func.isRequired,
    };

    // handleToggleSetting = () => historyPush(USERS.LINK_EDIT({ id: _.get(this.props.user, 'id', null) }));

    render () {
      const { roles, user, expanded } = this.props;
      return <UncontrolledDropdown nav inNavbar className="mr-md-3">
        <DropdownToggle nav className="pt-2 pb-2">
          <strong> {_.get(user, 'fullName', 'I')} </strong>&nbsp;
          <Avatar
            alt={_.get(user, 'fullName', 'I')}
            src={_.get(user, 'coverImage.url')}
            style={{ width: '39px', height: '39px' }}
          />
          <span className="badge badge-danger"> 100500 </span>
        </DropdownToggle>
        <DropdownMenu right className="animated flipInX">
          <DropdownItem header>
            <span className="d-flex align-items-center">
              <span> Roles: </span>
              {roles.map((role, i) => <Humanize
                key={i}
                tag="span"
                text={role}
                className="badge badge-danger ml-auto"
              />)}
            </span>
          </DropdownItem>
          <DropdownItem divider />
          <DropdownItem onClick={this.props.toggleAside}>
            <div className="media">
              <div className="align-self-start mr-3">
                <FasIcon size="2x" icon="bars" className="text-success" />
              </div>
              <div className="media-body">
                <p className="m-0"> Toggle menu </p>
                <p className="m-0 text-muted text-sm">{expanded ? 'Collapse' : 'Expand' }</p>
              </div>
            </div>
          </DropdownItem>
          <DropdownItem onClick={this.handleToggleSetting}>
            <div className="media">
              <div className="align-self-start mr-3">
                <FasIcon size="2x" icon="user-cog" className="text-primary" />
              </div>
              <div className="media-body">
                <p className="m-0"> Settings </p>
                <p className="m-0 text-muted text-sm"> My profile </p>
              </div>
            </div>
          </DropdownItem>
          <DropdownItem>
            <div className="media">
              <div className="align-self-start mr-3">
                <FasIcon size="2x" icon="envelope" className="text-warning" />
              </div>
              <div className="media-body">
                <p className="m-0"> Notifications </p>
                <p className="m-0 text-muted text-sm"> 100500 </p>
              </div>
            </div>
          </DropdownItem>
          <DropdownItem onClick={this.props.signOut}>
            <div className="media">
              <div className="align-self-start mr-3">
                <FasIcon size="2x" icon="sign-out-alt" className="text-danger" />
              </div>
              <div className="media-body">
                <p className="m-0"> Sign out </p>
                <p className="m-0 text-muted text-sm"> Destroy current session </p>
              </div>
            </div>
          </DropdownItem>
        </DropdownMenu>
      </UncontrolledDropdown>;
    }
}
export default connect(
  state => ({
    roles: [],
    user: {},
    expanded: false,
  }),
  dispatch => ({
    signOut: () => console.log('signOut'),
    toggleAside: () => console.log('toggleAside'),
  })
)(UserMenu);
