
// outsource dependencies
import _ from 'lodash';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';

// local dependencies
import FilterService from '../services/filter.service';

export class Filter extends PureComponent {
    static propTypes = {
      tag: PropTypes.string,
      options: PropTypes.object,
      children: PropTypes.string,
      type: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),
      value: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    };

    static defaultProps = {
      type: FilterService.humanize,
      children: null,
      options: {},
      tag: 'span',
      value: ''
    };

    render () {
      const { type, children, options, value, tag, ...attr } = this.props;
      const Tag = tag;
      const val = _.isString(children) ? children : value;
      const filter = _.isFunction(type) ? type : () => `Incorrect filter ${String(type)}`;
      return <Tag {...attr}> { filter(val, options) } </Tag>;
    }
}
export default Filter;

// filter shortcuts
export const Humanize = props => <Filter {...props} />;
export const Enum = props => <Filter {...props} type={FilterService.toEnum} />;
export const Truncate = props => <Filter {...props} type={FilterService.truncate} />;
export const Duration = props => <Filter {...props} type={FilterService.duration} />;
export const EscapeHtml = props => <Filter {...props} type={FilterService.escapeHtml} />;

// as part of filters
export class UnsafeHtml extends PureComponent {
    static propTypes = {
      tag: PropTypes.string,
      value: PropTypes.string.isRequired,
    };

    static defaultProps = {
      tag: 'span'
    };

    render () {
      const { value, tag, ...attr } = this.props;
      const Tag = tag;
      return <Tag {...attr} dangerouslySetInnerHTML={{ __html: value || '' }} />;
    }
}
