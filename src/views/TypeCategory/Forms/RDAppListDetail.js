import React from "react";
import PropTypes from "prop-types";

import { Card, CardHeader, CardBody } from "reactstrap";

export default class RDAppListDetail extends React.Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  getActions() {
    const allActions = (
      <div className="card-header-actions">
        <button
          id="close"
          className="card-header-action btn btn-new"
          onClick={this.props.onCloseDetail}
        >
          x
        </button>
      </div>
    );

    return allActions;
  }

  render() {
    if (!this.props.showDetail) return <div />;

    return (
      <Card style={{ border: "2", borderColor: "primary" }}>
        <CardHeader className="text-left">
          <strong>{this.props.detailItem.typeCode}</strong>
          {this.getActions()}
        </CardHeader>
        <CardBody>{this.props.children}</CardBody>
      </Card>
    );
  }
}

RDAppListDetail.propTypes = {
  showDetail: PropTypes.bool.isRequired,
  detailItem: PropTypes.objectOf(PropTypes.string),
  onCloseDetail: PropTypes.func,
  children: PropTypes.objectOf(React.Component)
};
