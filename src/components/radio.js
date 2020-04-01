
// outsource dependencies
import PropTypes from 'prop-types';
import { CustomInput } from 'reactstrap';
import React, { PureComponent } from 'react';

// local dependencies
import { RFControlWrap } from './redux-form-helpers';

export class ReduxRadio extends PureComponent {
    static propTypes = {
      skipTouch: PropTypes.bool,
      meta: PropTypes.object.isRequired,
      input: PropTypes.object.isRequired,
      options: PropTypes.array.isRequired,
      label: RFControlWrap.propTypes.label,
      usePopover: RFControlWrap.propTypes.usePopover,
      classNameFormGroup: RFControlWrap.propTypes.className,
    };

    static defaultProps = {
      label: null,
      skipTouch: false,
      usePopover: null,
      classNameFormGroup: '',
    };

    isChecked = value => value == this.props.input.value; // eslint-disable-line eqeqeq

    render () {
      const { input, meta, label, options, skipTouch, usePopover, classNameFormGroup, ...attr } = this.props;
      const message = skipTouch || meta.touched ? meta.error : null;
      return <RFControlWrap
        label={label}
        id={input.name}
        message={message}
        usePopover={usePopover}
        className={classNameFormGroup}
      >
        { (options || []).map((item, index) => <CustomInput
          type="radio"
          key={index}
          name={input.name}
          value={item.value}
          onChange={input.onChange}
          id={`radio-${input.name}-${index}`}
          checked={this.isChecked(item.value)}
          label={<strong> { item.label } </strong>}
          { ...attr }
        />)}
      </RFControlWrap>;
    }
}

export default ReduxRadio;
