
// outsource dependencies
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import { Container, Row, Col } from 'reactstrap';

// local dependencies
import { Logo } from '../../images';
import { BoxLoader } from '../../components/preloader';
import { selector, initializeAction, clearAction } from './reducer';

class WelcomeScreen extends PureComponent {
    static propTypes = {
      init: PropTypes.func.isRequired,
      clear: PropTypes.func.isRequired,
      initialized: PropTypes.bool.isRequired,
    };

    // static defaultProps = { };

    componentDidMount = () => this.props.init();

    componentWillUnmount = () => this.props.clear();

    render () {
      const { initialized } = this.props;
      return <Container fluid>
        <BoxLoader active={!initialized} style={{ height: '70vh' }}>
          <Row>
            <Col xs="12" className="text-center">
              <Logo className="img-fluid" style={{ width: 300 }} />
            </Col>
            <Col tag="h1" xs="12" className="text-center">
                        Welcome to the System
            </Col>
          </Row>
        </BoxLoader>
      </Container>;
    }
}

export default connect(
  state => ({
    initialized: selector(state).initialized,
  }),
  dispatch => ({
    clear: () => dispatch(clearAction()),
    init: () => dispatch(initializeAction()),
  })
)(WelcomeScreen);
