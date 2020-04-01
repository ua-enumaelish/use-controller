
// outsource dependencies
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import React, { useCallback, memo } from 'react';

// local dependencies
import { RFControlWrap } from './redux-form-helpers';

export const RFInput = memo(props => {
  const { input, type, meta, label, skipTouch, usePopover, classNameFormGroup, filter, ...attr } = props;
  const handleDrop = useCallback(event => {
    event.preventDefault();
    event.stopPropagation();
    switch (type) {
      default: return; // NOTE do nothing by default
      case 'text': return input.onChange(filter(event.dataTransfer.getData('text')));
    }
  }, [type, input, filter]);
  // NOTE prepare input actions
  const handleBlur = useCallback(event => input.onBlur(filter(event.target.value)), [input, filter]);
  const handleChange = useCallback(event => input.onChange(filter(event.target.value)), [input, filter]);
  // NOTE handle valid/invalid state and error message for input
  let message = '';
  if (skipTouch || meta.touched) {
    message = meta.error;
    attr.className += meta.valid ? ' is-valid' : ' is-invalid';
  }
  return <RFControlWrap
    label={label}
    id={input.name}
    message={message}
    usePopover={usePopover}
    className={classNameFormGroup}
  >
    <Input
      dir="auto"
      type={type}
      id={input.name}
      autoComplete="off"
      {...input}
      {...attr}
      onDrop={handleDrop}
      onBlur={handleBlur}
      onChange={handleChange}
    />
  </RFControlWrap>;
});
RFInput.propTypes = {
  type: PropTypes.string,
  filter: PropTypes.func,
  skipTouch: PropTypes.bool,
  className: PropTypes.string,
  meta: PropTypes.object.isRequired,
  input: PropTypes.object.isRequired,
  label: RFControlWrap.propTypes.label,
  usePopover: RFControlWrap.propTypes.usePopover,
  classNameFormGroup: RFControlWrap.propTypes.className,
};
RFInput.defaultProps = {
  label: null,
  type: 'text',
  className: '',
  filter: e => e,
  skipTouch: false,
  usePopover: null,
  classNameFormGroup: '',
};

export default RFInput;

