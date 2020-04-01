
// outsource dependencies
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { GithubPicker } from 'react-color';

// local dependencies
import { RFControlWrap } from './redux-form-helpers'; // TODO check updates for library to fix react 16.9.0+ compat

// configure
export const COLORS = [
  // NOTE just some colors
  '#555555', '#F5A623', '#F8E71C', '#8B572A', '#7ED321', '#417505', '#BD10E0', '#9013FE',
  '#4A90E2', '#50E3C2', '#B8E986', '#000000', '#4A4A4A', '#9B9B9B', '#D9E3F0', '#F47373',
  '#D0021B', '#697689', '#37D67A', '#2CCCE4', '#dce775', '#ff8a65', '#ba68c8'
];

export class RFInputColor extends Component {
    static propTypes = {
      disabled: PropTypes.bool,
      skipTouch: PropTypes.bool,
      className: PropTypes.string,
      meta: PropTypes.object.isRequired,
      input: PropTypes.object.isRequired,
      label: RFControlWrap.propTypes.label,
      usePopover: RFControlWrap.propTypes.usePopover,
      classNameFormGroup: RFControlWrap.propTypes.className,
    };

    static defaultProps = {
      label: null,
      disabled: false,
      skipTouch: false,
      className: 'form-control',
      classNameFormGroup: null,
      usePopover: RFControlWrap.defaultProps.usePopover,
    };

    constructor (...args) {
      super(...args);
      this.state = { show: false };
    }

    validColor = () => {
      const { input } = this.props;
      if (/^#([0-9a-f]{3,3}|[0-9a-f]{6,6})$/i.test(input.value)) { return input.value; }
      return '#555555';
    };

    render () {
      const { input, meta, label, skipTouch, usePopover, classNameFormGroup, className, ...attr } = this.props;
      let message = '', status = '';
      if (skipTouch || !meta.pristine || meta.touched) {
        message = meta.error;
        status = meta.valid ? 'is-valid' : 'is-invalid';
      }
      return <RFControlWrap
        label={label}
        id={input.name}
        message={message}
        usePopover={usePopover}
        className={classNameFormGroup}
      >
        <input
          id={input.name}
          autoComplete="off"
          value={input.value}
          onFocus={() => this.setState({ show: true })}
          onBlur={() => setTimeout(() => this.setState({ show: false }), 150)}
          style={{ backgroundColor: this.validColor(), color: '#fff' }}
          {...attr}
          onChange={e => input.onChange(e.target.value)}
          className={(className ? `${className } ` : '') + status}
        />
        <div style={{ position: 'relative' }}>
          { !this.state.show ? null : <div style={{ position: 'absolute', top: 10, left: 0, zIndex: '100' }}>
            <GithubPicker
              width={190}
              colors={COLORS}
              color={{ hex: this.validColor() }}
              onChange={({ hex }) => input.onChange(hex)}
            />
          </div> }
        </div>
      </RFControlWrap>;
    }
}

export default RFInputColor;
