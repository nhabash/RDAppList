import React from "react";
import PropTypes from "prop-types";

import {
  Card,
  CardHeader,
  CardBody,
  ListGroup,
  ListGroupItem
} from "reactstrap";

export default class RDAppList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  // List Header
  getActions() {
    const allActions = (
      <div className="card-header-actions">
        <button
          id="new"
          className="card-header-action btn btn-new"
          onClick={this.props.onAdd}
        >
          <i className="fa fa-dot-circle-o"> New</i>
        </button>
      </div>
    );

    return allActions;
  }

  // End Header

  render() {
    return (
      <Card style={{ border: "2", borderColor: "primary" }}>
        <CardHeader className="text-left">
          <strong>{this.props.title}</strong>
          {this.getActions()}
        </CardHeader>
        <CardBody>
          <ListGroup>
            {this.props.items &&
              this.props.items.map(item => {
                return (
                  <ListGroupItem
                    onClick={event => {
                      this.props.onSelect && this.props.onSelect(event, item);
                    }}
                  >
                    <div className="text-left">
                      {item}{" "}
                      <div className="card-header-actions">
                        <button
                          className="card-header-action btn btn-new"
                          onClick={event => this.props.onDelete(event, item)}
                        >
                          X
                        </button>
                      </div>
                    </div>
                  </ListGroupItem>
                );
              })}
          </ListGroup>
        </CardBody>
      </Card>
    );
  }
}

RDAppList.propTypes = {
  title: PropTypes.string.isRequired,
  items: PropTypes.arrayOf(PropTypes.string).isRequired,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onSelect: PropTypes.func
};
