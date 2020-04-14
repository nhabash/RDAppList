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
          {!this.props.readOnly ? this.getActions() : null}
        </CardHeader>
        <CardBody>
          <ListGroup>
            {this.props.items &&
              this.props.items.map((item, idx) => {
                return (
                  <ListGroupItem
                    key={`lgi_${item}_${idx}`}
                    onClick={event => {
                      this.props.onSelect && this.props.onSelect(event, item);
                    }}
                  >
                    <div className="text-left">
                      {item}{" "}
                      {!this.props.readOnly ? (
                        <div className="card-header-actions">
                          <button
                            className="card-header-action btn btn-new"
                            onClick={event => this.props.onDelete(event, item)}
                          >
                            X
                          </button>
                        </div>
                      ) : null}
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
  readOnly: PropTypes.bool,
  onAdd: PropTypes.func,
  onDelete: PropTypes.func,
  onSelect: PropTypes.func
};
