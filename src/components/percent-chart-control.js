
// outsource dependencies
import _ from 'lodash';
import Color from 'color';
import PropTypes from 'prop-types';
import React, { PureComponent } from 'react';
import { PieChart, Pie, Cell, Dot, Sector, Text } from 'recharts'; // TODO check updates for library to fix react 16.9.0+ compat

// local dependencies
import { PopoverError } from './redux-form-helpers/redux-form-control-wrap';

// configure
const WIDTH = 850;
const HEIGHT = 600;
const CX = WIDTH / 2;
const CY = HEIGHT / 2;
const agendaOffset = 50;
const RADIAN = Math.PI / 180;
const PERCENT_ANGLE = 100 / 360;
const COLORS = [
  Color('#489FDA'),
  Color('#AE543B'),
  Color('#868458'),
  Color('#D58D50'),
  Color('#C376E0'),
  Color('#61BD4F'),
  Color('#156F93'),
  Color('#FFD83D'),
];
const getColor = i => COLORS[i%COLORS.length];

class PercentChartControl extends PureComponent {
    static propTypes = {
      disabled: PropTypes.bool,
      meta: PropTypes.object.isRequired,
      input: PropTypes.object.isRequired,
      toSchema: PropTypes.func.isRequired,
      fromSchema: PropTypes.func.isRequired,
    };

    static defaultProps = {
      disabled: false,
    };

    constructor (...args) {
      super(...args);
      this.state = {
        list: [],
        inMove: null,
        selected: null,
        startAngle: 0,
        endAngle: 360,
      };
    }

    componentDidMount = () => this.extractFromReduxForm();

    componentDidUpdate = prev => !_.isEqual(prev.input.value, this.props.input.value) && this.extractFromReduxForm();

    extractFromReduxForm = () => {
      const { input, toSchema } = this.props;
      let list = _.isArray(input.value) ? input.value : [];
      // NOTE model to view value
      list = _.uniqBy(list.map(toSchema), 'order');
      list.sort((a, b) => a.order - b.order);
      this.setState({ list });
      // console.log(`%c extractFromReduxForm `, 'color: #fff; background: #232323; font-size: 12px;'
      //     , '\n list:', list
      //     , '\n input:', input.value
      // );
    };

    saveToReduxForm = () => {
      const { list } = this.state;
      const { input, fromSchema } = this.props;
      // NOTE restore model schema
      input.onChange(list.map(fromSchema));
      // console.log(`%c saveToReduxForm `, 'color: #fff; background: #232323; font-size: 12px;'
      //     , '\n list:', list
      //     , '\n input:', input.value
      // );
    };

    previousAngle = null;

    centerX = 0;

    centerY = 0;

    pieChartRef = null;

    getRef = ref => {
      this.pieChartRef = ref;
      if (!this.pieChartRef) { return; }
      const { left, top } = this.pieChartRef.container.getBoundingClientRect();
      this.centerX = left + (WIDTH / 2);
      this.centerY = top + (HEIGHT / 2);
    };

    getMoveDiff = event => {
      let diff = 0;
      // NOTE mouse position
      const mouseX = event.pageX;
      const mouseY = event.pageY;
      // NOTE horizontal offset from center
      const offsetX = mouseX - this.centerX;
      // NOTE vertical offset from center
      const offsetY = mouseY - this.centerY;
      // NOTE angle clockwise from X-axis, range -π .. π
      const theta = Math.atan2(offsetY, offsetX);
      // NOTE current mouse angle from same 0 as a chart
      const angle = theta * (180 / Math.PI);
      if (_.isNumber(this.previousAngle)) {
        // NOTE angle diff
        diff = this.previousAngle - angle;
      }
      // console.log(`%c DIFF `, 'color: #fff; background: #232323; font-size: 12px;'
      //     , '\n previousAngle:', this.previousAngle
      //     , '\n angle:', angle
      //     , '\n diff:', diff
      //     , '\n percentDiff:', diff * PERCENT_ANGLE
      // );
      // NOTE store angle
      this.previousAngle = angle;
      return diff;
    };

    handleMove = (element, event) => {
      const { disabled } = this.props;
      if (disabled) { return; }
      const { inMove, list, startAngle, endAngle } = this.state;
      if (!inMove || !this.pieChartRef) { return; }
      const diffAngle = this.getMoveDiff(event);
      // NOTE percent diff assume the total sum of all values of items is 100
      const diffValue = diffAngle * PERCENT_ANGLE;
      const currentIndex = _.findIndex(list, { order: inMove.order });
      const nextIndex = (currentIndex + 1) % list.length;
      const currentSector = list[currentIndex];
      const nextSector = list[nextIndex];
      // console.log(`%c MOVE `, 'color: #fff; background: #232323; font-size: 18px;'
      //     , '\n Sector Name:', inMove.name
      //     , '\n diffValue:', diffValue
      //     , '\n diffAngle:', diffAngle
      // );
      if (currentSector.value + diffValue >= 0 && nextSector.value - diffValue >= 0) {
        currentSector.value += diffValue;
        nextSector.value -= diffValue;
        // NOTE in case moving first element (separator between last and first item)
        if (nextIndex === 0) {
          // NOTE update view with zero point
          this.setState({
            list: list.slice(0),
            endAngle: endAngle + diffAngle,
            startAngle: startAngle + diffAngle
          });
        } else {
          // NOTE update view
          this.setState({ list: list.slice(0) });
        }
      }
      event.stopPropagation();
      event.preventDefault();
    };

    updateMoveItem = inMove => {
      this.previousAngle = null;
      this.setState({ inMove });
      if (!inMove && this.state.inMove) {
        // NOTE after item moving we should update form value
        this.saveToReduxForm();
      }
    };

    handleRemoveMeal = () => {
      const { list, selected } = this.state;
      const { input, fromSchema, disabled } = this.props;
      if (disabled) { return; }
      const result = _.filter(list, item => item.order !== selected.order);
      // NOTE reset percents
      const share = 100 / result.length;
      result.map(item => item.value = share);
      // NOTE update form value
      input.onChange(result.map(fromSchema));
    };

    handleSelectCell = selected => !this.props.disabled&&this.setState({ selected });

    render () {
      const { list, selected, inMove, startAngle, endAngle } = this.state;
      const { meta, disabled } = this.props;
      const isMoving = Boolean(inMove);
      return <PopoverError message={meta.error} usePopover="start" style={{ marginTop: 100 }}>
        <PieChart
          cx={CX}
          cy={CY}
          width={WIDTH}
          height={HEIGHT}
          ref={this.getRef}
          draggable={false}
          onMouseMove={this.handleMove}
          onMouseUp={() => this.updateMoveItem(null)}
          className={isMoving ? 'cursor-grabbing' : ''}
          onMouseLeave={() => this.updateMoveItem(null)}
        >
          <Pie
            data={list}
            nameKey="name"
            dataKey="value"
            labelLine={false}
            endAngle={endAngle}
            startAngle={startAngle}
            outerRadius={HEIGHT / 4}
            isAnimationActive={false}
            activeIndex={list.indexOf(selected)}
            activeShape={props => <ActiveShape {...props} removeItem={this.handleRemoveMeal} />}
            label={props => <>
              <PercentLabel {...props} />
              <MoveLabel {...props} updateMoveItem={this.updateMoveItem} isMoving={isMoving} />
              <AgendaLabel {...props} removeItem={this.handleRemoveMeal} />
            </>}
          >
            { list.map((item, index) => <Cell
              key={item.order}
              fill={getColor(index).toString()}
              onClick={() => this.handleSelectCell(item)}
              className={disabled ? '' : isMoving ? 'cursor-grabbing' : 'cursor-pointer'}
            />)}
          </Pie>
        </PieChart>
      </PopoverError>;
    }
}

export default PercentChartControl;

class PercentLabel extends PureComponent {
    static propTypes = {
      cx: PropTypes.number.isRequired,
      cy: PropTypes.number.isRequired,
      value: PropTypes.number.isRequired,
      percent: PropTypes.number.isRequired,
      midAngle: PropTypes.number.isRequired,
      outerRadius: PropTypes.number.isRequired,
    };

    // static defaultProps = { };

    render () {
      const { cx, cy, midAngle, outerRadius, percent, value } = this.props;
      const radius = Math.floor(outerRadius / 1.8);
      const x = cx + radius * Math.cos(-midAngle * RADIAN);
      const y = cy + radius * Math.sin(-midAngle * RADIAN);
      return <text
        x={x}
        y={y}
        fill="#FFF"
        fontSize="16"
        fontWeight={900}
        textAnchor="middle"
        style={{ pointerEvents: 'none' }}
      >
        {((percent * 100) || value).toFixed(1)}%
      </text>;
    }
}

class AgendaLabel extends PureComponent {
    static propTypes = {
      ...PercentLabel.propTypes,
      fill: PropTypes.string.isRequired,
    };

    // static defaultProps = { };

    render () {
      const { cx, cy, midAngle, outerRadius, name, fill } = this.props;
      const sin = Math.sin(-RADIAN * midAngle);
      const cos = Math.cos(-RADIAN * midAngle);
      const mx = cx + (outerRadius + agendaOffset) * cos;
      const my = cy + (outerRadius + agendaOffset) * sin;
      const ex = mx + (cos >= 0 ? 1 : -1) * 22;
      const textAnchor = cos >= 0 ? 'start' : 'end';
      return <Text
        y={my}
        // x={ex}
        width={160}
        // scaleToFit
        fill={fill}
        // angle={midAngle}
        fontSize="16"
        fontWeight={900}
        textAnchor={textAnchor}
        x={ex + (cos >= 0 ? 1 : -1) * 12}
        style={{ textDecoration: 'underline' }}
      >
        { name }
      </Text>;
    }
}

class MoveLabel extends PureComponent {
    static propTypes = {
      ...AgendaLabel.propTypes,
      isMoving: PropTypes.bool.isRequired,
      updateMoveItem: PropTypes.func.isRequired,
    };

    // static defaultProps = { };

    handleDown = () => this.props.updateMoveItem(this.props);

    render () {
      const { cx, cy, endAngle, outerRadius, value, fill, isMoving } = this.props;
      const offset = value < 2 ? 26 : 0;
      const radius = offset + outerRadius;
      const x = cx + radius * Math.cos(-endAngle * RADIAN);
      const y = cy + radius * Math.sin(-endAngle * RADIAN);
      return <Dot
        cx={x}
        cy={y}
        r={10}
        fill={fill}
        stroke="#FFFF"
        strokeWidth="2"
        draggable={false}
        onMouseDown={this.handleDown}
        className={isMoving ? 'cursor-grabbing' : 'cursor-grab'}
      />;
    }
}

class ActiveShape extends PureComponent {
    static propTypes = {
      ...AgendaLabel.propTypes,
      removeItem: PropTypes.func.isRequired,
    };

    // static defaultProps = { };

    render () {
      const { cx, cy, midAngle, innerRadius, outerRadius, startAngle, endAngle, fill } = this.props;
      const sin = Math.sin(-RADIAN * midAngle);
      const cos = Math.cos(-RADIAN * midAngle);
      const sx = cx + (outerRadius + 10) * cos;
      const sy = cy + (outerRadius + 10) * sin;
      const mx = cx + (outerRadius + agendaOffset) * cos;
      const my = cy + (outerRadius + agendaOffset) * sin;
      const ex = mx + (cos >= 0 ? 1 : -1) * 22;
      const ey = my;
      const textAnchor = cos >= 0 ? 'start' : 'end';
      return <g>
        <Sector
          cx={cx}
          cy={cy}
          fill={fill}
          endAngle={endAngle}
          startAngle={startAngle}
          innerRadius={innerRadius}
          outerRadius={outerRadius}
        />
        <Sector
          cx={cx}
          cy={cy}
          fill={fill}
          endAngle={endAngle}
          startAngle={startAngle}
          innerRadius={outerRadius + 5}
          outerRadius={outerRadius + 10}
        />
        <path d={`M${sx},${sy}L${mx},${my}L${ex},${ey}`} stroke={fill} fill="none"/>
        <circle cx={ex} cy={ey} r={3} fill={fill} stroke="none" />
        <text
          y={ey}
          dy={16}
          fill="red"
          stroke="red"
          fontSize="14"
          strokeWidth="0.5"
          textAnchor={textAnchor}
          className="cursor-pointer"
          onClick={this.props.removeItem}
          x={ex + (cos >= 0 ? 1 : -1) * 12}
        >
                Remove
        </text>
      </g>;
    }
}
