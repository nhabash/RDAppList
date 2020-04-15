import React, { Component } from 'react';
import {
    Card,
    CardBody,
    Form,
    Label,
    CardHeader,
    Col,
    FormGroup,
    Modal,
    ModalBody,
    ModalFooter,
    ModalHeader,
    Button,
    Input,
    FormFeedback,
} from 'reactstrap';

import { properties } from '../../AppProperties';
import Util from './Util';
import { AppModal } from '../AppModal';
import GenerateTable from './GenerateTable';

export default class GenerateModalForm extends Component {
    constructor(props) {
        super(props);

        if (props.forSchema === null || props.forSchema === undefined) {
            throw new Error("Unable to create for.  forSchema is null");
        }

        if (props.isWizard === null || props.isWizard === undefined) {
            throw new Error("Unable to create for.  isWizard is null");
        }

        this.appModalClose = this.appModalClose.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onNewForm = this.onNewForm.bind(this);
        this.onUpdateForm = this.onUpdateForm.bind(this);
        this.isError = this.isError.bind(this);
        this.onChange = this.onChange.bind(this);

        this.state = {
            data: this.props.data,
            attributeValues: [],
            attributesWithError: [],
            dirtyElements: [],
            showModal: false,
            modalMessage: null,
            modalTitle: null,
            requiredFields: [],
        }
    }

    componentDidMount() {
        this.getRequiredAttributes();
    }

    appModalClose() {
        this.setState({ showModal: false })
    }

    close() {
        this.props.onClose();
    }

    getRequiredAttributes() {
        console.log("GenerateModalForm: getRequiredAttributes ....");

        let reqAttr = [];
        if (!Util.isNullOrEmpty(this.props.forSchema.required)) {
            reqAttr = [...this.props.forSchema.required];
        }

        for (var attr in this.props.forSchema.properties) {
            let attrtype = this.props.forSchema.properties[attr].type;
            if (attrtype === 'array') {
                if (!Util.isArrayNullOrEmpty(this.props.forSchema.properties[attr].items.required)) {
                    reqAttr = [...reqAttr, ...this.props.forSchema.properties[attr].items.required];
                }
            } else if (attrtype === 'object') {

                for (var oattr in this.props.forSchema.properties[attr].properties) {
                    let attrrequired = this.props.forSchema.properties[attr].properties[oattr].primaryKey ? true : false;

                    if (attrrequired) {
                        if (!reqAttr.includes(oattr)) {
                            reqAttr = [...reqAttr, oattr];
                        }
                    }
                }
            }
        }

        if (!Util.isArrayNullOrEmpty(reqAttr)) {
            this.setState({ attributesWithError: [...reqAttr], requiredFields: [...reqAttr] });
        }
    }

    getAttributesFromForm(event) {

        const { attributeValues } = this.state;

        try {
            let entry = {
                "level1data": event.target.level1data.value,
                "level1dataSetKey": event.target.level1dataSetKey.value,
                "level1dataSetKeyValue": event.target.level1dataSetKeyValue.value,
            }

            attributeValues.push(entry);
        } catch (error) { }

        try {
            let entry = {
                "level2data": event.target.level2data.value,
                "level2dataSetKey": event.target.level2dataSetKey.value,
                "level2dataSetKeyValue": event.target.level2dataSetKeyValue.value,
            }

            attributeValues.push(entry);
        } catch (error) { }

        try {
            let entry = {
                "level3data": event.target.level3data.value,
                "level3dataSetKey": event.target.level3dataSetKey.value,
                "level3dataSetKeyValue": event.target.level3dataSetKeyValue.value,
            }

            attributeValues.push(entry);
        } catch (error) { }

        try {
            let entry = {
                "level4data": event.target.level4data.value,
                "level4dataSetKey": event.target.level4dataSetKey.value,
                "level4dataSetKeyValue": event.target.level4dataSetKeyValue.value,
            }

            attributeValues.push(entry);
        } catch (error) { }

        return attributeValues;
    }

    onDataChange(data) {
        console.log("Data: " + JSON.stringify(data, null, 2));
    }

    onSubmit(event) {
        if (this.state.attributesWithError.length > 0) {
            console.error("Form has errors!!");
            this.setState({ showModal: true, modalTitle: "Save Error", modalMessage: "Form has errors!!" });
            return;
        }

        // Check if all required fields have values
        let canSubmit = true;

        this.getAttributesFromForm().forEach(a => {
            if (this.isFieldRequired(a.attributeName) && Util.isNullOrEmpty(a.attributeValue)) {
                canSubmit = false;
            }
        });

        if (!canSubmit) {
            console.error("Form has errors!!");
            this.setState({ showModal: true, modalTitle: "Save Error", modalMessage: "Form has errors!!  Required field is missing value" });
            return;
        }

        if (this.props.operation === 'new')
            this.onNewForm(event);

    }

    onUpdateForm(event) {
        //event.preventDefault();

        let attributeValues = this.getAttributesFromForm();

        this.props.onDataUpdate(attributeValues, this.props.dataSetKey, this.props.data);

        this.close();
    }

    onNewForm(event) {
        //event.preventDefault();
        /*if (this.validateForm()) {
          return;
        }*/

        let attributeValues = this.getAttributesFromForm();

        this.props.onNewData(attributeValues, this.props.dataSetKey, this.props.onRow);

        this.close();
    }

    getValue(attr) {
        if (this.state.data === null || this.state.data === undefined) {
            return "";
        }

        let attrValue = null;
        if (typeof (this.state.data) === 'object') {
            attrValue = this.state.data.get(attr);
        }
        else {
            attrValue = this.state.data[attr];
        }
        return attrValue === null || attrValue === undefined ? "" : attrValue;
    }

    /*
    inputFieldWithDefault(attr, maxlength, attrValue, attrrequired, stageid) {
      if (attrrequired === "required") {
        return <>
          <Input type="text" id={attr} name={attr} maxLength={maxlength} size={maxlength.toString()} defaultValue={attrValue} required onBlur={(e) => { this.onChange(e) }} />
          <FormFeedback>You must specify a valid value for {attr}.</FormFeedback></>
      } else {
        return <Input type="text" id={attr} name={attr} maxLength={maxlength} size={maxlength.toString()} defaultValue={attrValue} onBlur={(e) => { this.onChange(e) }} />
      }
    }

    inputFieldWithPlaceholder(attr, maxlength, attrValue, attrrequired, stageid) {
      if (attrrequired === "required") {
        //Mark this field as invalid to ensure user has feedback to provide value
        return <><Input type="text" id={attr} name={attr} maxLength={maxlength} size={maxlength.toString()} placeholder={"Enter " + Util.makeDescription(attr)} required onBlur={(e) => { this.onChange(e) }} />
          <FormFeedback>You must specify a valid value for {attr}.</FormFeedback></>

      } else {
        return <Input type="text" id={attr} name={attr} maxLength={maxlength} size={maxlength.toString()} placeholder={"Enter " + Util.makeDescription(attr)} onBlur={(e) => { this.onChange(e) }} />
      }
    }
    */

    inputFieldWithDefault(attr, maxlength, attrValue, attrrequired, stageid) {
        if (attrrequired === "required") {
            return <>
                <Input key={Util.generateKey(attr + maxlength + attrValue + "inputtypetext")} type="text" id={attr} name={attr} maxLength={maxlength} size={maxlength.toString()} defaultValue={attrValue} required onBlur={(e) => { this.onChange(e) }} valid={!this.isError(attr)} invalid={this.isError(attr)} />
                <FormFeedback>You must specify a valid value for {attr}.</FormFeedback></>
        } else {
            return <Input key={Util.generateKey(attr + maxlength + attrValue + "inputtypetext")} type="text" id={attr} name={attr} maxLength={maxlength} size={maxlength.toString()} defaultValue={attrValue} onBlur={(e) => { this.onChange(e) }} />
        }
    }


    inputFieldWithPlaceholder(attr, maxlength, attrValue, attrrequired, stageid) {
        if (attrrequired === "required") {
            //Mark this field as invalid to ensure user has feedback to provide value
            return <><Input key={Util.generateKey(attr + maxlength + attrValue + "inputtypetext")} type="text" id={attr} name={attr} maxLength={maxlength} size={maxlength.toString()} placeholder={"Enter " + Util.makeDescription(attr)} required onBlur={(e) => { this.onChange(e) }} valid={!this.isError(attr)} invalid={this.isError(attr)} />
                <FormFeedback>You must specify a valid value for {attr}.</FormFeedback></>

        } else {
            return <Input key={Util.generateKey(attr + maxlength + attrValue + "inputtypetext")} type="text" id={attr} name={attr} maxLength={maxlength} size={maxlength.toString()} placeholder={"Enter " + Util.makeDescription(attr)} onBlur={(e) => { this.onChange(e) }} />
        }
    }

    getTextFormGroup(attr, attrrequired, maxlength, stageid) {
        let av = this.getValue(attr);
        let attrValue = av === null || av === undefined || av.length <= 0 ? "" : av;

        return <FormGroup key={Util.generateKey(attr + maxlength + attrValue)} row>
            <Col sx="12" md="4" lg="4">
                <Label htmlFor={attr} style={{ display: 'block' }}><strong>{attr}: {attrrequired === "required" ? <font color="red">*</font> : null}</strong></Label>
            </Col>
            <Col sx="12" md="8" lg="8">
                {
                    attrValue !== "" ? this.inputFieldWithDefault(attr, maxlength, attrValue, attrrequired, stageid) : this.inputFieldWithPlaceholder(attr, maxlength, attrValue, attrrequired, stageid)
                }
            </Col>
        </FormGroup>
    }

    getArrayFormGroup(objectName, objectData, object, attrs, formelements) {
        if (object === null || object === undefined) {
            return;
        }
        if (object.items === null || object.items === undefined) {
            return;
        }
        if (object.items.properties === null || object.items.properties === undefined) {
            return;
        }

        this.getObjectFormGroup(objectName, object.items, attrs, formelements);

        let data = object.items.properties;

        let requiredArray = object.items.required;

        let arrayElements = [];
        let embeddedAttrs = [];
        // eslint-disable-next-line
        let embeddedArrayElements = [];
        let embeddedArraykey = "";
        let deeper = false;

        for (var attr in data) {
            let attrtype = object.items.properties[attr].type;

            // eslint-disable-next-line
            let attrlength = data.hasOwnProperty("maxLength") ? object.properties[attr].maxLength : 0;

            // eslint-disable-next-line
            let attrrequired = requiredArray !== null && requiredArray !== undefined && requiredArray.includes(attr) ? "required" : "";

            embeddedArraykey = requiredArray !== null && requiredArray !== undefined && requiredArray.includes(attr) ? attr : "id";

            if (attrtype === 'string') {
                attrs.push(attr);
            } else if (attrtype === "object") {
                this.getObjectFormGroup(attr, objectData.properties[attr], attrs, formelements);
            } else if (attrtype === 'array') {
                deeper = true;
                this.getArrayFormGroup(attr, embeddedAttrs);
            }
        }

        embeddedArraykey = requiredArray !== null && requiredArray !== undefined ? requiredArray[0] : "id";

        // eslint-disable-next-line
        let attrValue = this.getValue(embeddedArraykey);

        let newRow = null;

        // Handle main array
        arrayElements.push(<FormGroup key={Util.generateKey(attr)} row>
            <Col sx="12" md="12" lg="12">
                <GenerateTable
                    forSchema={object.items}
                    dataSetKey={embeddedArraykey}
                    formTitle={objectName}
                    rowExpandComponent={deeper ? this : null}
                    isFlatTable={false} // Follow JSON in schema and expand attributes of type "object"
                    atLevel={this.props.atLevel + 1}
                    data={objectData} // data=TypeCategory, this table is for TypeCategory.Type
                    newRow={newRow}
                    onRow={this.props.onRow}
                    onNewData={this.onNewData}
                    onDataUpdate={this.props.onDataUpdate}
                    saveRecordsToDatabase={this.props.onSaveRecordsToDatabase}
                    onRecordDelete={this.onRecordDelete}
                    onDeleteAll={this.props.deleteAll}
                    auth={this.props.auth} />
            </Col>
        </FormGroup>
        );

        return arrayElements;
    }

    isRequired(object, attr) {
        let attrrequired = object.required ? object.required.includes(attr) ? true : false : false;

        if (!attrrequired) {
            attrrequired = object.properties[attr].primaryKey ? true : false;
        }

        return attrrequired;
    }

    getObjectFormGroup(objectName, object, attrs, formelements) {
        let data = object.properties;
        let myformelements = [];

        for (var attr in data) {
            let attrtype = object.properties[attr].type;
            let attrlength = data.hasOwnProperty("maxLength") ? object.properties[attr].maxLength : 0;
            //let attrrequired = object.properties[attr].primaryKey ? "required" : "";
            let attrrequired = this.isRequired(object, attr) ? "required" : "";

            if (attrtype === 'string') {
                attrs.push(attr);
                myformelements.push(this.getTextFormGroup(attr, attrrequired, attrlength === 0 ? 100 : attrlength));
            } else if (attrtype === "object") {
                this.getObjectFormGroup(attr, attrs, myformelements);
            } else if (attrtype === 'array') {
                this.getObjectFormGroup(attr, object.properties[attr].items, attrs, myformelements);
            }
        }

        formelements.push(<FormGroup key={Util.generateKey(attr)} className="border border-primary">
            <Card>
                <CardHeader><strong>{objectName}</strong></CardHeader>
                <CardBody>
                    {myformelements}
                </CardBody></Card></FormGroup>);
    }

    formFromSchema() {
        let attrs = [];
        let data = this.props.forSchema.properties;

        let formelements = [];

        for (var attr in data) {
            let attrtype = this.props.forSchema.properties[attr].type;
            let attrlength = this.props.forSchema.properties[attr].maxLength;
            //let attrrequired = this.props.forSchema.properties[attr].primaryKey ? "required" : "";
            let attrrequired = this.props.forSchema.required ? this.props.forSchema.required.includes(attr) ? "required" : "" : "";

            if (attrtype === 'string') {
                attrs.push(attr);
                formelements.push(this.getTextFormGroup(attr, attrrequired, attrlength === 0 ? 100 : attrlength));
            } else if (attrtype === "object") {
                this.getObjectFormGroup(attr, this.props.forSchema.properties[attr], attrs, formelements);
            } else if (attrtype === 'array') {
                let thisObjectsData = this.getObjectData(Util.firstCharacterLowerCase(attr));
                this.getArrayFormGroup(attr, thisObjectsData, this.props.forSchema.properties[attr], attrs, formelements);
            }
        }

        let dataID = "level" + this.props.atLevel + "data";
        let dataSetKeyID = "level" + this.props.atLevel + "dataSetKey";

        const newRecordForm = <Form key={Util.generateKey(attr + dataSetKeyID + "0")} id="modalform" onSubmit={this.onSubmit}>
            <Input key={Util.generateKey(attr + dataSetKeyID + "1")} type="hidden" id={dataID} name={dataID} value={JSON.stringify(this.state.data)} />
            <Input key={Util.generateKey(attr + dataSetKeyID + "2")} type="hidden" id={dataSetKeyID} name={dataSetKeyID} value={this.props.dataSetKey} />
            <Card>
                <CardBody>
                    {formelements}
                </CardBody>
            </Card>
            <FormGroup key={Util.generateKey(attr + dataSetKeyID + "3")} row className="float-right">
                <div className="input-group">
                    <Button size="sm" color="secondary" onClick={this.close.bind(this)}>Close</Button>
                    <Button size="sm" color="primary" onClick={(e) => { this.onSubmit(e) }}>Save</Button>
                </div>
            </FormGroup>
        </Form>

        return newRecordForm;

    }

    getObjectData(attr, parent) {
        let thisObjectsData = this.state.data[attr];
        if (thisObjectsData === null || thisObjectsData === undefined || thisObjectsData.length === 0) {
            thisObjectsData = this.state.data.get(attr);
            if (thisObjectsData === null || thisObjectsData === undefined) {
                if (typeof (thisObjectsData) === 'object') {
                    if (thisObjectsData !== null && thisObjectsData !== undefined) {
                        let elem = thisObjectsData[0];
                        if (elem === null || elem === undefined) {
                            throw new Error("cannot find the right data");
                        } else {
                            thisObjectsData = this.state.data[0].get(attr);
                            if (thisObjectsData === null || thisObjectsData === undefined) {
                                throw new Error("cannot find the right data");
                            }
                        }
                    } else {
                        if (parent === null || parent === undefined) {
                            throw new Error("cannot find the right data");
                        }
                        thisObjectsData = this.state.data[parent][0].get(attr);
                        if (thisObjectsData === null || thisObjectsData === undefined) {
                            throw new Error("cannot find the right data");
                        }
                    }
                }
            }
        }
        return thisObjectsData;
    }


    /**
     * Checks if the given field (attr) has been
     * marked as in error for the "current stage"
     *
     * @param {*} attr
     */
    isError(attr, field) {
        if (this.state.attributesWithError === null && this.state.attributesWithError === undefined) return false;
        return this.state.attributesWithError.includes(attr);
    }

    isFieldRequired(field) {
        const { requiredFields } = this.state;
        return requiredFields.includes(field);
    }

    markAsFailed(attr) {
        const { attributesWithError } = this.state;
        if (!attributesWithError.includes(attr) && this.isFieldRequired(attr)) {
            this.setState({ attributesWithError: [...attributesWithError, attr] });
        }
    }

    markValid(attr) {
        const { attributesWithError } = this.state;
        if (attributesWithError.includes(attr)) {
            let temp = attributesWithError.filter(f => { return f !== attr });
            this.setState({ attributesWithError: [...temp] });
        }
    }

    validateRequired(value) {
        if (value.target.hasAttribute('required')) {
            if (Util.isNullOrEmpty(value.target.value)) {
                return false;
            }

            if (value.target.value.length === 0) {
                return false;
            }
        }

        return true; // valid
    }

    validate(value) {
        let overall = [];
        console.log("@@@@ [" + properties.validationRules + "] @@@@");
        properties.validationRules.map(vr => {
            Object.entries(vr).map(([field, rule]) => {
                if (field === value.target.id) {
                    let vrt = rule.validationType;
                    let vrv = rule.validationRule;
                    if (!Util.isNullOrEmpty(vrv)) {
                        console.log("FormValidation: Rule [" + vrt + "] and Pattern [" + vrv + "]");

                        let result = vrv.test(value.target.value);
                        if (!result) {
                            console.error("FormValidation: Rule [" + vrt + "] and Pattern [" + vrv + "] failed for value [" + value.target.value + "]");
                        }

                        overall.push(result);
                    }
                }
                return overall;
            });

            return overall;
        });

        let finalResult = true;

        if (overall.length === 0) {
            finalResult = false;
        }

        overall.forEach(r => {
            if (!r) finalResult = false;
        });

        return finalResult;
    }
    /* End Form Validation */

    onChange(value) {
        value.preventDefault();

        const { attributeValues } = this.state;

        let de = this.state.dirtyElements;

        de.push(value.target.id);

        if (!this.validate(value)) {
            this.markAsFailed(value.target.id);
            value.target.valid = false;
            value.target.invalid = true;
        } else {
            this.markValid(value.target.id);
            value.target.valid = true;
            value.target.invalid = false;
        }

        let index = -1;
        let found = attributeValues?.filter(entry => {
            return entry.attributeName === value.target.id;
        });

        index = attributeValues?.indexOf(found);

        if (found?.length > 0) {
            found[0].attributeValue = value.target.value;
            attributeValues[index] = found;
        } else {
            let entry = {
                "attributeName": Util.firstCharacterLowerCase(value.target.id),
                "attributeValue": value.target.value,
                "valid": true,
            }

            attributeValues.push(entry);
        }

        this.setState({ attributeValues: [...attributeValues] });

    }

    render() {
        let title = "Create " + this.props.formTitle;
        if (this.props.operation === 'update') {
            title = "Update " + this.props.formTitle;
        }

        return (
            <div>
                <Modal isOpen={this.props.show} toggle={this.close.bind(this)} className="modal-lg">
                    <ModalHeader toggle={this.close.bind(this)}>
                        <div className="d-flex justify-content-start">{title}</div>
                    </ModalHeader>

                    <ModalBody>
                        <Card className="w-100">
                            <CardBody>
                                {this.formFromSchema()}
                            </CardBody>
                        </Card>
                    </ModalBody>

                    <ModalFooter>
                    </ModalFooter>

                </Modal>

                <AppModal
                    showModal={this.state.showModal}
                    bodyMessage={this.state.modalMessage}
                    titleMessage={this.state.modalTitle}
                    handleClose={this.appModalClose} />

            </div>
        );

    }
}
