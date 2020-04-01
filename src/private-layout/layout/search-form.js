
// outsource dependencies
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import React, { PureComponent } from 'react';

// local dependencies
import { FasIcon } from '../../components/fa-icon';
import { setMetaAction, submitSearchForm, selector } from './reducer';

class SearchForm extends PureComponent {
    static propTypes = {
      open: PropTypes.bool.isRequired,
      value: PropTypes.string.isRequired,
      onSubmit: PropTypes.func.isRequired,
      onCancel: PropTypes.func.isRequired,
      onChange: PropTypes.func.isRequired,
    };

    /**
     * catch when status of form did change to visible and setup focus for input
     */
    componentDidUpdate (prevProps) {
      // NOTE only on start showing form
      if (prevProps.open === false && this.props.open === true && this.inputElement) {
        this.inputElement.focus();
      }
    }

    handleSubmit = e => {
      e.preventDefault();
      const { value, onSubmit } = this.props;
      onSubmit({ value });
    };

    render () {
      const { open, value, onCancel, onChange } = this.props;
      return <form
        role="search"
        autoComplete="off"
        onSubmit={this.handleSubmit}
        onKeyDown={e => e.keyCode === 27 && onCancel()}
        className={`navbar-form${!open ? '' : ' open' }`}
      >
        <div className="form-group">
          <input
            type="text"
            value={value}
            className="form-control"
            ref={ref => this.inputElement = ref}
            onChange={e => onChange(e.target.value)}
            placeholder="Type and hit enter ... or escape to cancel"
          />
          <FasIcon icon="times" tag="div" className="navbar-form-close" onClick={onCancel} />
        </div>
      </form>;
    }
}

export default connect(
  state => ({
    value: selector(state).search,
    open: selector(state).showSearch,
  }),
  dispatch => ({
    onSubmit: formData => dispatch(submitSearchForm(formData)),
    onChange: value => dispatch(setMetaAction({ search: value })),
    onCancel: () => dispatch(setMetaAction({ showSearch: false, search: '' })),
  })
)(SearchForm);
