import React from "react";
import "./App.scss";
import "./styles.css";
import schema from "./views/TypeCategory/Model/schema.json";
import typeCategory1 from "./views/TypeCategory/_testdata/NT_ISOJurisdictionType";
import typeCategory2 from "./views/TypeCategory/_testdata/EDPExchangeRateType";
import typeCategory3 from "./views/TypeCategory/_testdata/FUMAInvestorType";
import GenerateTable from "./views/Common/GenerateTable";
import TypeCategoryType from "./views/TypeCategory/Model/TypeCategoryType";
import Util from "./views/Common/Util";
import TypeCategoryWizard from "./views/TypeCategory/Forms/TypeCategoryWizard";
import TypeCategory from "./views/TypeCategory/Model/TypeCategory";

export default class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [typeCategory1, typeCategory2, typeCategory3]
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
    const { data } = this.state;

    console.log(`App: data: [${JSON.stringify(data, null, 2)}]`);

    return (
      <div className="App">
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
        <GenerateTable
          forSchema={schema}
          dataSetKey="TypeCategoryIdentifierText"
          formTitle="TypeCategory"
          rowExpandComponent={TypeCategoryWizard}
          isFlatTable={false} // Follow JSON in schema and expand attributes of type "object"
          atLevel={0}
          withActions={true}
          isEditable={true}
          newRow={new TypeCategory()}
          data={this.state.data}
          onSelect={this.onSelect.bind(this)}
          onAddType={this.onAddType.bind(this)}
          onDelete={this.onDelete.bind(this)}
        />
      </div>
    );
  }
}
