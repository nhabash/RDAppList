import React from "react";
import RDAppList from "./RDAppList";
import { Row, Col } from "reactstrap";
import RDAppListDetail from "./RDAppListDetail";
import TypeCategoryTypeForm from "./TypeCategoryTypeForm";

export default class TypeCategoryTypeList extends React.Component {
  constructor(props) {
    super(props);

    /**
     * props.data === TypeCategory
     */
    this.state = {
      data:
        props.data &&
        props.data.type.map(t => {
          return t.typeCode;
        }),
      showDetail: false,
      detailItem: null
    };
  }

  updateDetail(item) {
    this.setState({ showDetail: true, detailItem: item });
  }

  emptyDetail() {
    this.setState({ showDetail: false, detailItem: null });
  }

  // item === typeCode
  onSelect(event, item) {
    let found = this.props.data.type.filter(t => {
      return t.typeCode === item;
    });

    if (found.length === 0) return;

    this.setState(
      this.emptyDetail.bind(this),
      this.updateDetail.bind(this, found[0])
    );

    this.props.onSelect && this.props.onSelect(event, item);
  }

  // item === typeCode
  onAddType() {
    let newObj = null;
    if (this.props.onAddType) newObj = this.props.onAddType();
    this.localAddItem(newObj);
  }

  // item === typeCode
  onDelete(event, item) {
    this.onCloseDetail();

    this.props.onDelete && this.props.onDelete(event, item);

    this.localDeleteItem(item);

    event.preventDefault();
  }

  localAddItem(item) {
    const { data } = this.state;

    item && data.push(item.typeCode);
  }

  localDeleteItem(item) {
    const { data } = this.state;
    let filtereddata = data.filter(i => i !== item);
    this.setState({ data: [...filtereddata] });
  }

  onCloseDetail() {
    this.emptyDetail();
  }

  render() {
    const { data, showDetail, detailItem } = this.state;
    let _colSize = {};

    if (showDetail) {
      _colSize["sm"] = 6;
    }

    return (
      <Row>
        <Col {..._colSize}>
          <RDAppList
            title="Type Codes"
            items={data}
            onAdd={this.onAddType.bind(this)}
            onDelete={this.onDelete.bind(this)}
            onSelect={this.onSelect.bind(this)}
          />
        </Col>
        {showDetail ? (
          <Col {..._colSize}>
            <RDAppListDetail
              showDetail={showDetail}
              detailItem={detailItem}
              onCloseDetail={this.onCloseDetail.bind(this)}
            >
              <TypeCategoryTypeForm data={detailItem} />
            </RDAppListDetail>
          </Col>
        ) : null}
      </Row>
    );
  }
}
