import React from "react";
import "./App.scss";
import "./styles.css";
import typeCategory from "./views/TypeCategory/_testdata/NT_ISOJurisdictionType";
import TypeCategoryWizard from "./views/TypeCategory/Forms/TypeCategoryWizard";
import TypeCategoryType from "./views/TypeCategory/Model/TypeCategoryType";
import Util from "./views/Common/Util";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: typeCategory
    };
  }

  // item === typeCode
  onSelect(event, selectedTypeCode) {
    console.log(`App: onSelect invoked with item=[${selectedTypeCode}]`);
  }

  // item === typeCode
  onAddType() {
    const { data } = this.state;

    let originalObject = data;

    let obj = new TypeCategoryType();
    obj.setTypeCode(Util.uuidv4());

    originalObject.type.push(obj);

    this.setState({ data: originalObject });

    console.log(
      `onAddType: originalObject: ${JSON.stringify(originalObject, null, 2)}`
    );

    return obj;
  }

  // item === typeCode
  onDelete(event, item) {
    const { data } = this.state;

    let originalObject = data;

    let fd = originalObject.type.filter(i => i.typeCode !== item);

    originalObject.type = [...fd];

    this.setState({ data: originalObject });
  }

  render() {
    return (
      <div className="App">
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
        <TypeCategoryWizard
          data={this.state.data}
          onSelect={this.onSelect.bind(this)}
          onAddType={this.onAddType.bind(this)}
          onDelete={this.onDelete.bind(this)}
        />
      </div>
    );
  }
}
