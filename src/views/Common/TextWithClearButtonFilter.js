import React from "react";
import PropTypes from 'prop-types';
import { Input } from "reactstrap";

export default class TextWithClearButtonFilter extends React.Component {

  constructor(props) {
    super(props);
    this.filter = this.filter.bind(this);
    this.cleanFiltered = this.cleanFiltered.bind(this);

    this.state = {
      value: this.props.defaultValue || ''
    };

  }

  cleanFiltered() {

    if (this.state.value) {

      var value = this.props.defaultValue ? this.props.defaultValue : '';
      this.setState(function () {
        return { value: value };
      });

      this.props.filterHandler(value);
    }

  }

  filter(event) {

    var _this2 = this;

    if (this.timeout) {

      clearTimeout(this.timeout);
    }

    var filterValue = event.target.value;

    this.setState(function () {
      return { value: filterValue };
    });

    this.timeout = setTimeout(function () {
      if (filterValue) {
        _this2.props.filterHandler(filterValue);
      } else {
        _this2.props.filterHandler(_this2.props.defaultValue);
      }
    }, _this2.props.delay);

  }

  render() {
    return (
      <div className="input-group input-group-sm mb-3">
        <Input className="form-control form-control-sm" placeholder="Search ..."
          describedby="clearbutton"
          onChange={this.filter}
          value={this.state.value}
          type="text" />
        <div className="input-group-prepend">
          <button className="btn btn-outline-secondary" type="button" style={{backgroundColor: 'white'}} onClick={this.cleanFiltered}>
            <i className="fa fa-window-close" aria-hidden="true"></i>
          </button>
        </div>
      </div>
    );
  }
}

TextWithClearButtonFilter.propTypes = {
  filterHandler: PropTypes.func.isRequired,
  defaultValue: PropTypes.string,
  delay: PropTypes.number
};

TextWithClearButtonFilter.defaultProps = {
  delay: 2000
};
/*
  <div>
            <InputGroup bsSize="small">
                <Input
                    type="text"
                    placeholder="Search"
                    style={{width:90}}
                    onChange={this.filter}
                    value={this.state.value}
                />
                <InputGroup.Addon className="hoverHand" onClick={this.cleanFiltered}>
                    <Glyphicon glyph="remove" />
                </InputGroup.Addon>
            </InputGroup>
      </div>
export function getTextWithClearButtonFilter(filterHandler, customFilterParameters) {
  return (
    <TextWithClearButtonFilter filterHandler={filterHandler} />
  );
}
*/
