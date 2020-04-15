import React, { Component } from "react";
import {
  Col,
  Row,
  Card,
  CardBody,
  DropdownMenu,
  DropdownItem,
  DropdownToggle,
  ButtonDropdown,
  ButtonGroup,
  CardHeader,
  Button
} from "reactstrap";
import { useMediaQuery } from "react-responsive";

import ToolkitProvider, { Search } from "react-bootstrap-table2-toolkit";
import BootstrapTable from "react-bootstrap-table-next";
import filterFactory, { customFilter } from "react-bootstrap-table2-filter";
import paginationFactory from "react-bootstrap-table2-paginator";

import GenerateModalForm from "./GenerateModalForm";
import { AppModal } from "../AppModal";
import TextWithClearButtonFilter from "./TextWithClearButtonFilter";
import TypeCategoryWizard from "../TypeCategory/Forms/TypeCategoryWizard";

import Util from "./Util";

import { properties } from "../../AppProperties";
import PopupForm from "./PopupForm";
import TypeCategory from "../TypeCategory/Model/TypeCategory";

// eslint-disable-next-line
const { SearchBar } = Search;

// eslint-disable-next-line
const Desktop = ({ children }) => {
  const isDesktop = useMediaQuery({ minWidth: 992 });
  return isDesktop ? children : null;
};

// eslint-disable-next-line
const Tablet = ({ children }) => {
  const isTablet = useMediaQuery({ minWidth: 768, maxWidth: 991 });
  return isTablet ? children : null;
};

// eslint-disable-next-line
const Mobile = ({ children }) => {
  const isMobile = useMediaQuery({ maxWidth: 767 });
  return isMobile ? children : null;
};

// eslint-disable-next-line
const Default = ({ children }) => {
  const isNotMobile = useMediaQuery({ minWidth: 768 });
  return isNotMobile ? children : null;
};

const MySearch = props => {
  let input;
  const handleClick = () => {
    props.onSearch(input.value);
  };
  const clear = () => {
    input.value = "";
    handleClick();
  };
  return (
    <div className="input-group">
      <input
        className="form-control form-control-sm"
        placeholder="Enter search term ..."
        ref={n => (input = n)}
        onBlur={handleClick}
        type="text"
      />
      <div className="input-group-append">
        <label className="btn btn-sm btn-outline-secondary" onClick={clear}>
          <i className="fa fa-window-close" aria-hidden="true" />
        </label>
      </div>
    </div>
  );
};

function columnFormatter(column, colIndex, { sortElement, filterElement }) {
  return (
    <Row>
      <Col sx="10" md="10" lg="10">
        {Util.firstCharacterUpperCase(column.text)}
      </Col>
      <Col sx="2" md="2" lg="2">
        {!Util.isNullOrEmpty(sortElement) ? sortElement : null}
      </Col>
      {!Util.isNullOrEmpty(filterElement) ? filterElement : null}
    </Row>
  );
}

const selectRow = {
  clickToSelect: true,
  clickToExpand: true,
  hideSelectColumn: true,
  bgColor: "#00BFFF",
  mode: "radio"
  /*headerColumnStyle: (status) => {
        return {
            backgroundColor: properties.ScheduleSetDataTableScreen.selectedRowColumnBackgroundColor
        };
    },*/
};

export default class GenerateTable extends Component {
  constructor(props) {
    super(props);

    this.loading = () => (
      <div className="animated fadeIn pt-1 text-center">
        <div className="sk-spinner sk-spinner-pulse" />
      </div>
    );

    if (props.forSchema === null || props.forSchema === undefined) {
      throw new Error("Unable to create for.  forSchema is null");
    }

    //if (props.dataSetKey === null || props.dataSetKey === undefined) {
    //  throw new Error("Unable to create for.  dataSetKey is null");
    //}

    if (props.formTitle === null || props.formTitle === undefined) {
      throw new Error("Unable to create for.  formTitle is null");
    }

    if (props.isFlatTable === null || props.isFlatTable === undefined) {
      throw new Error("Unable to create for.  isFlatTable is null");
    }

    this.onDataUpdate = this.onDataUpdate.bind(this);
    this.getActions = this.getActions.bind(this);
    this.onClose = this.onClose.bind(this);
    this.onNewData = this.onNewData.bind(this);
    this.onEditClicked = this.onEditClicked.bind(this);
    this.getSmallTableActions = this.getSmallTableActions.bind(this);
    this.getTableActions = this.getTableActions.bind(this);
    this.getOperationType = this.getOperationType.bind(this);
    this.appModalClose = this.appModalClose.bind(this);
    this.exportToOracle = this.exportToOracle.bind(this);
    this.onViewMappingsClicked = this.onViewMappingsClicked.bind(this);

    this.state = {
      showModal: false,
      modalMessage: null,
      modalTitle: null,
      needsRefresh: false,
      data: props.data,
      startNew: false,
      dropdownOpen: new Array(19).fill(false),
      selectedRow: null,
      doImport: false,
      changedRecords: props.chnagedRecords || [],
      modalData: null,
      modalShow: false,
      newRow: this.props.newRow,
      openPopup: false,
      popupObject: null
    };

    this.columns = [];
    this.columnsSmallScreen = [];

    this.expandedRow = null;

    this.processSchema();
  }

  componentDidMount() {
    this.setState({ data: [...this.props.data] });
  }

  appModalClose() {
    this.setState({ showModal: false });
  }

  getObjectFormGroup(object, attrs) {
    let data = object.properties;

    for (var attribute in data) {
      let attr = Util.firstCharacterLowerCase(attribute);

      let attrtype = object.properties[attribute].type;
      let attrformat = object.properties[attribute].format;

      // eslint-disable-next-line
      let attrlength = data.hasOwnProperty("maxLength")
        ? object.properties[attribute].maxLength
        : 0;

      // eslint-disable-next-line
      let attrrequired = object.properties[attribute].primaryKey
        ? "required"
        : "";

      if (attrtype === "string") {
        attrs.push({ attr: attr, type: attrtype, format: attrformat });
      } else if (attrtype === "object") {
        this.getObjectFormGroup(attribute, attrs);
      }
    }
  }

  getColumnNameWidth(col) {
    let MAX_WIDTH = 200;
    let w = Util.makeDescription(col).length;
    if (w < MAX_WIDTH || w > MAX_WIDTH) w = MAX_WIDTH;
    return w;
  }

  processSchema() {
    let attrs = [];
    let data = this.props.forSchema.properties;

    if (
      this.props.forSchema.required === null ||
      this.props.forSchema.required === undefined
    ) {
      this.props.forSchema.required = [];
    }

    let requiredArray = this.props.forSchema.required?.map(e => {
      return Util.firstCharacterLowerCase(e);
    });

    for (var attribute in data) {
      let attr = Util.firstCharacterLowerCase(attribute);

      let attrtype = this.props.forSchema.properties[attribute].type;
      let attrformat = this.props.forSchema.properties[attribute].format;

      // eslint-disable-next-line
      let attrlength = this.props.forSchema.properties[attribute].maxLength;

      // eslint-disable-next-line
      let attrrequired = this.props.forSchema.properties[attribute].primaryKey
        ? "required"
        : "";

      if (attrtype === "string" || attrtype === "integer") {
        attrs.push({
          attr: attr,
          type: attrtype,
          format: attrformat,
          requiredArray: requiredArray.includes(attr)
        });
      } else if (attrtype === "object" && this.props.isFlatTable) {
        this.getObjectFormGroup(
          this.props.forSchema.properties[attribute],
          attrs
        );
      }
    }

    let first = {
      dataField: "id",
      text: "ID",
      hidden: false,
      sort: true,
      headerFormatter: (column, colIndex, { sortElement, filterElement }) => {
        return (
          <div>
            {Util.firstCharacterUpperCase(column.text)}
            {!Util.isNullOrEmpty(sortElement) ? sortElement : null}
          </div>
        );
      },
      headerStyle: {
        width: "80px"
      },
      sortCaret: (order, column) => {
        if (!order)
          return (
            <span>
              <i className="fa fa-arrow-down" aria-hidden="true" />
            </span>
          );
        if (order === "asc")
          return (
            <span>
              <i className="fa fa-arrow-down" aria-hidden="true" />
            </span>
          );
        if (order === "desc")
          return (
            <span>
              <i className="fa fa-arrow-up" aria-hidden="true" />
            </span>
          );
        return null;
      }
    };

    let last = {
      dataField: "",
      text: "Actions",
      isDummyField: true,
      headerStyle: {
        width: "40px",
        verticalAlign: "middle",
        textAlign: "center"
      },
      formatter: this.getActions
    };

    this.columns.push(first);
    this.columnsSmallScreen.push(first);

    if (
      requiredArray === null ||
      requiredArray === undefined ||
      requiredArray.length < 3
    ) {
      requiredArray = attrs.map(a => {
        return a.attr;
      });
    }

    let fc = this.findColumn(requiredArray[0], attrs);
    let firstcol = this.generateColumnDefinition(
      fc,
      this.getColumnNameWidth(fc.attr),
      this.dataFormatter.bind(this)
    );

    this.columnsSmallScreen.push(firstcol);
    this.columns.push(firstcol);

    //requiredArray.forEach(a => {
    for (var i = 1; i < requiredArray.length && i <= 1; i++) {
      let a = this.findColumn(requiredArray[i], attrs);
      if (a !== null) {
        let col = this.generateColumnDefinition(
          a,
          this.getColumnNameWidth(a.attr),
          this.dataFormatter.bind(this)
        );
        this.columns.push(col);
      }
    }

    this.columns.push(last);

    this.columnsSmallScreen.push(last);
  }

  findColumn(obj, sourceArray) {
    for (var i = 0; i < sourceArray.length; i++) {
      if (sourceArray[i].attr === obj) {
        return sourceArray[i];
      }
    }
    return null;
  }

  generateColumnDefinition(col, colWidth, withFormatter) {
    const mystyleWithWidth = {
      verticalAlign: "middle",
      textAlign: "left",
      width: colWidth
    };

    const mystyleWithNoWidth = {
      verticalAlign: "middle",
      textAlign: "left",
      width: "20px"
    };

    const mystyle = colWidth > 0 ? mystyleWithWidth : mystyleWithNoWidth;

    return {
      dataField: Util.firstCharacterLowerCase(col.attr),
      text: Util.makeDescription(col.attr),
      sort: true,
      filter: customFilter(),
      filterRenderer: (onFilter, column) => (
        <TextWithClearButtonFilter filterHandler={onFilter} />
      ),
      headerFormatter: columnFormatter,
      headerStyle: mystyle,
      formatExtraData: {
        col: col.attr,
        colWidth: colWidth + 100,
        type: col.format
      },
      formatter: withFormatter,
      sortCaret: (order, column) => {
        if (!order)
          return (
            <span>
              <i className="fa fa-arrow-down" aria-hidden="true" />
            </span>
          );
        if (order === "asc")
          return (
            <span>
              <i className="fa fa-arrow-down" aria-hidden="true" />
            </span>
          );
        if (order === "desc")
          return (
            <span>
              <i className="fa fa-arrow-up" aria-hidden="true" />
            </span>
          );
        return null;
      }
    };
  }

  dataFormatter(cell, row, rowIndex, extradata) {
    let width = "50px";
    let type = "";

    if (extradata) {
      width = extradata.colWidth;
      type = extradata.type;
    }

    let celldata = cell;

    if (type === "date-time") {
      let _date = new Date(cell);
      celldata = _date.toLocaleDateString() + " " + _date.toLocaleTimeString();
    }

    return (
      <span
        style={{
          display: "block",
          whiteSpace: "nowrap",
          textOverflow: "ellipsis",
          overflow: "hidden",
          width: width,
          textAlign: "left"
        }}
      >
        {celldata}
      </span>
    );
  }

  onEditClicked(event, cell, row, data) {
    event.preventDefault();
    this.props.onRowEdit(row);
  }

  onDeleteClicked(event, cell, row, data) {
    event.preventDefault();
    this.props.onRecordDelete(row);
  }

  onPopup(event, cell, row, newItem) {
    this.setState({ openPopup: true, popupObject: newItem });
  }

  onPopupClose() {
    this.setState({ openPopup: false });
  }

  onViewMappingsClicked(event, cell, row, data) {
    this.props.onViewMappingsClicked(event, cell, row, data);
  }

  getAddedAction(cell, row) {
    if (!this.props.importedAndAdded) {
      return null;
    }

    let key = Util.firstCharacterLowerCase(this.props.dataSetKey);

    let newfound = this.props.importedAndAdded.filter(d => {
      return d[key] === row[key];
    });

    if (newfound && newfound.length === 1) {
      return (
        <Button
          className="btn btn-sm"
          color="dark"
          onClick={event => {
            this.onPopup(event, cell, row, newfound[0]);
          }}
        >
          N
        </Button>
      );
    }

    return null;
  }

  getChangedAction(cell, row) {
    if (!this.props.importedAndChanged) {
      return null;
    }

    let key = Util.firstCharacterLowerCase(this.props.dataSetKey);

    let found = this.props.importedAndChanged.filter(d => {
      return d.new[key] === row[key];
    });

    if (found && found.length === 1) {
      return (
        <Button
          className="btn btn-sm"
          color="dark"
          onClick={event => {
            this.props.onShowSideBySide(event, cell, row, found[0]);
          }}
        >
          C
        </Button>
      );
    }

    return null;
  }

  getViewAction(cell, row) {
    return (
      <Button
        className="btn btn-sm"
        outline
        color="dark"
        onClick={event => {
          this.props.onView(event, cell, row);
        }}
      >
        <i className="fa fa-file-text-o" aria-hidden="true" />
      </Button>
    );
  }

  getActions(cell, row) {
    if (!this.props.withActions) return <div />;

    return (
      <ButtonGroup className="float-right">
        {this.props.onView && this.getViewAction(cell, row)}
        {this.getChangedAction(cell, row)}
        {this.getAddedAction(cell, row)}
        {this.props.onRowEdit ? (
          <Button
            className="btn btn-sm"
            outline
            color="dark"
            onClick={event => {
              this.onEditClicked(event, cell, row);
            }}
          >
            <i className="fa fa-pencil" />
          </Button>
        ) : null}
        {this.props.onViewMappingsClicked ? (
          <Button
            className="btn btn-sm"
            outline
            color="dark"
            onClick={event => {
              this.onViewMappingsClicked(event, cell, row);
            }}
          >
            <i className="fa fa-map-o" />
          </Button>
        ) : null}
        <Button
          className="btn btn-sm"
          outline
          color="danger"
          onClick={event => {
            this.onDeleteClicked(event, cell, row);
          }}
        >
          <i className="fa fa-trash" />
        </Button>
      </ButtonGroup>
    );
  }

  onDataUpdate(udata, key, onRow) {
    console.log(
      "GenerateTable(atLevel: " +
        this.props.atLevel +
        "): onDataUpdate: data:" +
        JSON.stringify(udata) +
        " @@@ Current Row: " +
        JSON.stringify(this.state.data[this.expandedRow], null, 2) +
        " @@@"
    );

    const { data } = this.state;

    //let found = data.filter(d => { return d.id === onRow.id });
    if (data === null || data === undefined) {
      // this is something funcky
      console.error(
        "GenerateTable(atLevel: " +
          this.props.atLevel +
          "): onDataUpdate: data: is null"
      );
      return;
    }

    let index = this.expandedRow - 1;
    /*if (data.length === 1) {
          index = this.expandedRow - 1;
        } else {
          index = this.expandedRow;
        }*/

    let found = data[index];

    if (found === null || found === undefined || found.length === 0) {
      console.error(
        "GenerateTable(atLevel: " +
          this.props.atLevel +
          "): onDataUpdate: data:" +
          JSON.stringify(udata) +
          ": Unable to find row @@ " +
          onRow +
          " @@"
      );
      return;
    }

    let nr = found;

    if (udata.length === undefined) {
      // at Level2, found is TypeCategory and udata is TypeCategoryType
      // We should call found.updateValues or maybe add
      // then perform nr=result of that call
      found.updateData(udata);
      nr = udata;
    } else {
      udata.forEach(e => {
        nr.updateValues(e);
      });
    }

    if (this.props.atLevel === 0) {
      console.log("use this for a breakpoint");
    }

    this.props.onDataUpdate(nr, this.props.dataSetKey, found);

    this.setState({ needsRefresh: true });
  }

  getOperationType(row) {
    try {
      if (typeof row === "object") {
        if (row.isNewOrEmpty()) {
          return "new";
        } else {
          return "update";
        }
      }
    } catch (exception) {
      //
    }

    return "new";
  }

  expandRow = {
    onlyOneExpanding: true,
    showExpandColumn: true,
    expandByColumnOnly: true,
    parentClassName: "selectedRow",

    expanded: [this.expandedRow],

    onExpand: (row, isExpand, rowIndex, e) => {
      if (isExpand) {
        this.expandedRow = rowIndex;
      } else {
        this.expandedRow = null;
      }

      console.log(
        `GenerateTable: atLevel: ${this.props.atLevel} expandedRow: ${
          this.expandedRow
        }`
      );
    },

    renderer: row => {
      let typeCategory = new TypeCategory(row);

      return (
        <TypeCategoryWizard
          title={typeCategory.getTypeCategoryIdentifierText()}
          data={typeCategory}
          readOnly={this.props.isEditable}
          onSelect={this.props.onSelect}
          onAddType={this.props.onAddType}
          onDelete={this.props.onDelete}
        />
      );
    },

    expandHeaderColumnRenderer: ({ isAnyExpands }) => {
      return (
        <div
          style={{
            width: "20px",
            verticalAlign: "middle",
            textAlign: "center"
          }}
        >
          {isAnyExpands ? <b>-</b> : <b>+</b>}
        </div>
      );
    },
    expandColumnRenderer: ({ expanded }) => {
      if (expanded) {
        return (
          <b>
            <i className="fa fa-ellipsis-h" />
          </b>
        );
      }
      return (
        <b>
          <i className="fa fa-ellipsis-h" />
        </b>
      );
    }
  };

  exportToCSV(data) {
    var csv = this.props.onExportCSV(data);

    var exportedFilename = Util.uuidv4() + ".csv";

    var blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, exportedFilename);
    } else {
      var link = document.createElement("a");
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        var url = URL.createObjectURL(blob);
        link.setAttribute("href", url);
        link.setAttribute("download", exportedFilename);
        link.style.visibility = "hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  }

  exportToOracle() {
    const { data } = this.state;

    if (this.props.exportToOracle && this.props.exportToOracle !== undefined) {
      this.props.exportToOracle(data);
    } else {
      console.error("Unable to export to oracle...");
    }
  }

  action(event) {
    event.preventDefault();

    switch (event.target.id) {
      case "new":
        this.setState({ startNew: true });
        return;
      case "exportcsv":
        this.exportToCSV(this.state.data);
        return;
      case "exportMatrix":
        this.props.saveRecordsToDatabase(this.state.data);
        return;
      case "import":
        if (this.props.onImportData) {
          this.props.onImportData();
        }
        //this.setState({ doImport: true });
        return;
      case "deleteAll":
        if (
          window.confirm(
            properties.ScheduleSetDataTableScreen.actions.deleteAll.promptText
          )
        ) {
          this.props.onDeleteAll(this.state.data);
        }
        return;
      case "exportoracle":
        this.exportToOracle();
        break;
      default:
        console.log("action: " + event.target.id);
        return;
    }
  }

  componentDidLoad() {
    this.setState({ data: [...this.props.data], doImport: false });
  }

  toggle(i) {
    const newArray = this.state.dropdownOpen.map((element, index) => {
      return index === i ? !element : false;
    });
    this.setState({
      dropdownOpen: [...newArray]
    });
  }

  handleSelection(row, isSelect) {
    if (isSelect) {
      this.setState({ selectedRow: row });
      return;
    } else {
      this.setState({ selectedRow: null });
    }
  }

  onClose() {
    this.setState({ modalData: null, modalShow: false });
  }

  closeNew() {
    this.setState({ startNew: false });
  }

  onNewData(newdata, key, onRow) {
    console.log(
      "GenerateTable(atLevel: " +
        this.props.atLevel +
        "): onNewData: newdata:" +
        JSON.stringify(newdata, null, 2) +
        " @@@ onRow: " +
        JSON.stringify(onRow, null, 2) +
        " @@@"
    );

    const { newRow, data } = this.state;
    let nr = null;

    if (onRow === null || onRow === undefined) {
      nr = newRow;
    } else if (typeof onRow === "number") {
      try {
        nr = data[onRow - 1];
      } catch (error) {
        return;
      }
    } else {
      nr = onRow;
    }

    if (newdata.length === undefined) {
      nr = newdata;
    } else {
      newdata.forEach(e => {
        nr.updateValues(e);
      });
    }

    if (!nr.checkRequired()) {
      console.error("Form has errors!!");
      this.setState({
        showModal: true,
        modalTitle: "Save Error",
        modalMessage: "Form has errors!!  Required field is missing value"
      });
      return;
    }

    if (onRow === null || onRow === undefined) {
      nr.setID(data.length + 1);
      if (data[0].getName() !== nr.getName()) {
        this.props.onNewData(nr, this.props.dataSetKey, data);
      } else {
        data.push(nr);
        this.props.onDataUpdate(nr, this.props.dataSetKey, data);
      }
    } else {
      try {
        data[this.expandedRow] = onRow;
        this.props.onNewData(nr, this.props.dataSetKey, data[this.expandedRow]);
      } catch (error) {
        return;
      }
    }

    this.closeNew();
  }

  createCustomInsertButton = onClick => {
    return (
      <button style={{ color: "red" }} onClick={onClick}>
        Add rows
      </button>
    );
  };

  getSmallTableActions() {
    const allActions = (
      <div className="card-header-actions">
        <ButtonGroup className="float-right">
          <ButtonDropdown
            size="sm"
            isOpen={this.state.dropdownOpen[18]}
            toggle={() => {
              this.toggle(18);
            }}
          >
            <DropdownToggle className="card-header-action" color="white">
              <i className="fa fa-ellipsis-v" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem id="new" onClick={this.action.bind(this)}>
                <i className="fa fa-dot-circle-o" />{" "}
                {properties.ScheduleSetDataTableScreen.actions.new.label}
              </DropdownItem>
              <DropdownItem id="deleteAll" onClick={this.action.bind(this)}>
                <i className="fa fa-trash" />{" "}
                {properties.ScheduleSetDataTableScreen.actions.deleteAll.label}
              </DropdownItem>
              <DropdownItem id="import" onClick={this.action.bind(this)}>
                <i className="fa fa-dot-circle-o" />{" "}
                {properties.ScheduleSetDataTableScreen.actions.import.label}
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem id="exportcsv" onClick={this.action.bind(this)}>
                {properties.ScheduleSetDataTableScreen.actions.exportCSV.label}
              </DropdownItem>
              <DropdownItem id="exportMatrix" onClick={this.action.bind(this)}>
                {
                  properties.ScheduleSetDataTableScreen.actions.exportMatrix
                    .label
                }
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem id="exportoracle" onClick={this.action.bind(this)}>
                {
                  properties.ScheduleSetDataTableScreen.actions.exportOracle
                    .label
                }
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </ButtonGroup>
      </div>
    );

    const newActions = (
      <div className="card-header-actions">
        <ButtonGroup className="float-right">
          <ButtonDropdown
            size="sm"
            isOpen={this.state.dropdownOpen[0]}
            toggle={() => {
              this.toggle(0);
            }}
          >
            <DropdownToggle caret className="card-header-action" color="white">
              <i className="cil-options" />
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem id="new" onClick={this.action.bind(this)}>
                <i className="fa fa-dot-circle-o" />{" "}
                {properties.ScheduleSetDataTableScreen.actions.new.label}
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </ButtonGroup>
      </div>
    );

    var actions = allActions;

    if (this.props.atLevel > 0) {
      actions = newActions;
    }

    return actions;
  }

  getTableActions() {
    const allActions = (
      <div className="card-header-actions">
        <button
          id="new"
          className="card-header-action btn btn-new"
          onClick={this.action.bind(this)}
        >
          <i className="fa fa-dot-circle-o" />{" "}
          {properties.ScheduleSetDataTableScreen.actions.new.label}
        </button>
        <button
          id="deleteAll"
          className="card-header-action btn btn-new"
          onClick={this.action.bind(this)}
        >
          <i className="fa fa-trash" />{" "}
          {properties.ScheduleSetDataTableScreen.actions.deleteAll.label}
        </button>
        <button
          id="import"
          className="card-header-action btn btn-new"
          onClick={this.action.bind(this)}
        >
          <i className="fa fa-dot-circle-o" />{" "}
          {properties.ScheduleSetDataTableScreen.actions.import.label}
        </button>
        <ButtonGroup className="float-right">
          <ButtonDropdown
            size="sm"
            isOpen={this.state.dropdownOpen[18]}
            toggle={() => {
              this.toggle(18);
            }}
          >
            <DropdownToggle caret className="card-header-action" color="white">
              <i className="fa fa-arrow-circle-o-down" /> Export
            </DropdownToggle>
            <DropdownMenu right>
              <DropdownItem id="exportcsv" onClick={this.action.bind(this)}>
                {properties.ScheduleSetDataTableScreen.actions.exportCSV.label}
              </DropdownItem>
              <DropdownItem id="exportMatrix" onClick={this.action.bind(this)}>
                {
                  properties.ScheduleSetDataTableScreen.actions.exportMatrix
                    .label
                }
              </DropdownItem>
              <DropdownItem divider />
              <DropdownItem id="exportoracle" onClick={this.action.bind(this)}>
                {
                  properties.ScheduleSetDataTableScreen.actions.exportOracle
                    .label
                }
              </DropdownItem>
            </DropdownMenu>
          </ButtonDropdown>
        </ButtonGroup>
      </div>
    );

    const newActions = (
      <div className="card-header-actions">
        <button
          id="new"
          className="card-header-action btn btn-new"
          onClick={this.action.bind(this)}
        >
          <i className="fa fa-dot-circle-o" />{" "}
          {properties.ScheduleSetDataTableScreen.actions.new.label}
        </button>
      </div>
    );

    // eslint-disable-next-line
    const exportActionML = (
      <div className="card-header-actions">
        <button
          id="exportMatrix"
          className="card-header-action btn btn-new"
          onClick={this.action.bind(this)}
        >
          <i className="fa fa-dot-circle-o" />{" "}
          {properties.ScheduleSetDataTableScreen.actions.exportMatrix.label}
        </button>
      </div>
    );

    var actions = allActions;

    if (this.props.atLevel > 0) {
      actions = newActions;
    }

    return actions;
  }

  render() {
    const newEntryForm = (
      <GenerateModalForm
        forSchema={this.props.forSchema}
        formTitle={this.props.formTitle}
        isWizard={true}
        operation="new"
        data={this.state.newRow}
        atLevel={this.props.atLevel}
        onRow={this.expandedRow}
        dataSetKey={this.props.dataSetKey}
        show={this.state.startNew}
        onClose={this.closeNew.bind(this)}
        onNewData={this.onNewData.bind(this)}
      />
    );

    const updateEntryForm = (
      <GenerateModalForm
        forSchema={this.props.forSchema}
        formTitle={this.props.formTitle}
        isWizard={true}
        operation="update"
        data={this.state.modalData}
        atLevel={this.props.atLevel}
        dataSetKey={this.props.dataSetKey}
        show={this.state.modalShow}
        onClose={this.onClose.bind(this)}
        onDataUpdate={this.onDataUpdate.bind(this)}
      />
    );

    const defaultSorted = [
      {
        dataField: "id",
        order: "desc"
      }
    ];

    const options = {
      hidePageListOnlyOnePage: true,
      insertBtn: this.createCustomInsertButton
    };

    const theTable = (
      <div>
        <ToolkitProvider
          keyField="id"
          data={this.state.data}
          columns={this.columns}
          search
        >
          {props => (
            <Card
              className="w-100"
              style={{ borderLeft: "4", borderLeftColor: "green" }}
            >
              <CardHeader>
                <Row>
                  <Col sm="8" md="6" lg="6">
                    <MySearch {...props.searchProps} />
                  </Col>
                  <Col sm="4" md="6" lg="6">
                    <Default>{this.getTableActions()}</Default>
                    <Mobile>{this.getSmallTableActions()}</Mobile>
                  </Col>
                </Row>
              </CardHeader>

              <CardBody>
                <BootstrapTable
                  bootstrap4
                  wrapperClasses="table-responsive"
                  {...props.baseProps}
                  defaultSorted={defaultSorted}
                  bordered={false}
                  striped
                  hover
                  condensed
                  options={options}
                  filter={filterFactory()}
                  filterPosition="bottom"
                  pagination={paginationFactory()}
                  expandRow={this.expandRow}
                  selectRow={selectRow}
                  insertRow
                />
              </CardBody>
            </Card>
          )}
        </ToolkitProvider>
      </div>
    );

    // eslint-disable-next-line
    const theTableSmallScreen = (
      <div>
        <ToolkitProvider
          keyField="id"
          data={this.state.data}
          columns={this.columnsSmallScreen}
          search
        >
          {props => (
            <Card
              className="w-100"
              style={{ borderLeft: "4", borderLeftColor: "green" }}
            >
              <CardHeader>
                {/*<SearchBar {...props.searchProps} id={this.uuidv4} />*/}
                <Row>
                  <Col sm="8" md="6" lg="6">
                    <MySearch {...props.searchProps} />
                  </Col>
                  <Col sm="4" md="6" lg="6">
                    <Default>{this.getTableActions()}</Default>
                    <Mobile>{this.getSmallTableActions()}</Mobile>
                  </Col>
                </Row>
              </CardHeader>

              <CardBody>
                <BootstrapTable
                  bootstrap4
                  wrapperClasses="table-responsive"
                  {...props.baseProps}
                  defaultSorted={defaultSorted}
                  bordered={false}
                  striped
                  hover
                  condensed
                  options={options}
                  filter={filterFactory()}
                  filterPosition="bottom"
                  pagination={paginationFactory()}
                  expandRow={this.expandRow}
                  selectRow={selectRow}
                  insertRow
                />
              </CardBody>
            </Card>
          )}
        </ToolkitProvider>
      </div>
    );

    return (
      <>
        <div className="w-100">
          {this.state.startNew ? newEntryForm : <div />}
          {this.state.modalShow ? updateEntryForm : <div />}
          <Default>{theTable}</Default>
          <Mobile>{theTableSmallScreen}</Mobile>
        </div>

        {this.state.openPopup ? (
          <PopupForm
            show={this.state.openPopup}
            forSchema={this.props.forSchema}
            atLevel={0}
            data={this.state.popupObject}
            isEditable={false}
            formTitle="TypeCategory"
            operation="new"
            onRow={this.state.popupObject.id}
            dataSetKey={this.props.dataSetKey}
            onDataUpdate={this.onDataUpdate}
            onNewData={this.onNewData}
            onRecordDelete={this.props.onRecordDelete}
            onClose={this.onPopupClose.bind(this)}
          />
        ) : null}

        <AppModal
          showModal={this.state.showModal}
          bodyMessage={this.state.modalMessage}
          titleMessage={this.state.modalTitle}
          handleClose={this.appModalClose}
        />
      </>
    );
  }
}
