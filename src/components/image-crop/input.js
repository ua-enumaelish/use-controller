
// outsource dependencies
import _ from 'lodash';
import PropTypes from 'prop-types';
import Dropzone from 'react-dropzone';
import React, { PureComponent } from 'react';

// local dependencies
import DefImage from '../../images';
import { showModal } from './index';
import { RFControlWrap } from '../redux-form-helpers';

class RFInputImage extends PureComponent {
    static propTypes = {
      disabled: PropTypes.bool,
      skipTouch: PropTypes.bool,
      cropOptions: PropTypes.object,
      meta: PropTypes.object.isRequired,
      input: PropTypes.object.isRequired,
      classNameFormGroup: PropTypes.string,
      usePopover: RFControlWrap.propTypes.usePopover,
      label: PropTypes.oneOfType([PropTypes.node, PropTypes.string, PropTypes.element]),
    };

    static defaultProps = {
      label: null,
      disabled: false,
      skipTouch: true,
      usePopover: null,
      cropOptions: null,
      classNameFormGroup: '',
    };

    handleDrop = ([file]) => {
      const { input, cropOptions } = this.props;
      showModal(file, cropOptions)
        .then(({ url }) => input.onChange(url))
        .catch(({ message }) => console.warn(
          '%c Image has not been updated ',
          'color: #fff; background: #FF7C05; font-weight: bolder; font-size: 12px;',
          `Reason: ${message}`
        ));
    };

    render () {
      const { input, meta, label, skipTouch, classNameFormGroup, usePopover, cropOptions, ...attr } = this.props;
      let message = '';
      if (skipTouch || meta.touched) {
        message = meta.error;
        if (_.isString(attr.className)) {
          attr.className += meta.valid ? ' is-valid' : ' is-invalid';
        }
      }
      return <RFControlWrap
        id={input.name}
        message={message}
        usePopover={usePopover}
        className={classNameFormGroup}
        label={<div onClick={() => this.ref && this.ref.open()}> {label} </div>}
      >
        <Dropzone
          ref={ref => this.ref = ref}
          rejectClassName="reject"
          activeClassName="active"
          acceptClassName="success"
          style={{ height: 'auto' }}
          disabledClassName="disabled"
          className="form-control drop-zone"
          accept="image/jpe, image/jpg, image/jpeg, image/gif, image/png"
          { ...attr }
          onDrop={this.handleDrop}
        >
          <DefImage
            src={input.value}
            defaultClassName="img-fluid"
            defaultAlt="Input image preview"
            defaultTitle="Input image preview"
          />
        </Dropzone>
      </RFControlWrap>;
    }
}

export default RFInputImage;
