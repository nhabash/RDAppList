/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
    Card,
    CardBody,
    Form,
    Label,
    CardHeader,
    Col,
    FormGroup,
    Button,
    Input,
    FormFeedback,
} from 'reactstrap';

import GenerateTable from './GenerateTable';

import Util from './Util';
import TypeCategoryForm from '../TypeCategory/Forms/TypeCategoryForm';

export default class GenerateForm extends Component {
    constructor(props) {
        super(props);

        if (props.forSchema === null || props.forSchema === undefined) {
            throw new Error("Unable to create for.  forSchema is null");
        }

        if (props.formTitle === null || props.formTitle === undefined) {
            throw new Error("Unable to create for.  formTitle is null");
        }

        this.toggle = this.toggle.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onNewData = this.onNewData.bind(this);
        this.onDataUpdate = this.onDataUpdate.bind(this);
        this.onRecordDelete = this.onRecordDelete.bind(this);

        this.state = {
            data: this.props.data,
            sbsCollapse: false,
            attributes: [],
            attributeValues: [],
            dirtyElements: [],
            attributesWithError: [],
        }

        this.formFromSchema();
    }

    componentDidMount() {
    }

    toggle() {
        this.setState({ sbsCollapse: !this.state.sbsCollapse });
    }

    close() {
        this.props.onClose();
    }

    onDataChange(data) {
        console.log("Data: " + JSON.stringify(data, null, 2));
    }

    onNewData(newdata, key, onRow) {
        console.log("GenerateForm(atLevel: " + this.props.atLevel + "): onNewData: newdata:" + JSON.stringify(newdata, null, 2) + " dataSetKey: " + key + " @@@ onRow: " + JSON.stringify(onRow, null, 2) + " @@@");

        //
        // we need somehow to update our current state data (which is typecategorytype)
        // at the right location (which should be tagsForm)
        // with contents of onRow (which is the tagsArray)
        // and then setState
        //    ==> how to do that without knowing the actual object hierarchy
        // BELOW IS FIRST ATTEMPT AND SEEMS TO WORK
        const { data } = this.state;
        data.set(onRow);
        //this.setState({data: data});
        this.props.onNewData(newdata, key, data);
    }

    onDataUpdate(newdata, key, onRow) {
        console.log("GenerateForm(atLevel: " + this.props.atLevel + "): onNewData: newdata:" + JSON.stringify(newdata, null, 2) + " dataSetKey: " + key + " @@@ onRow: " + JSON.stringify(onRow, null, 2) + " @@@");

        //
        // we need somehow to update our current state data (which is typecategorytype)
        // at the right location (which should be tagsForm)
        // with contents of onRow (which is the tagsArray)
        // and then setState
        //    ==> how to do that without knowing the actual object hierarchy
        // BELOW IS FIRST ATTEMPT AND SEEMS TO WORK
        const { data } = this.state;
        if (newdata !== onRow) {
            data.set(onRow);
        }
        //this.setState({data: data});
        this.props.onDataUpdate(newdata, key, data);
    }

    onSubmit(event) {
        event.preventDefault();

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

        console.log("GenerateForm: Operation: " + this.props.operation);

        switch (this.props.operation) {
            case 'update':
                this.props.onDataUpdate(attributeValues, this.props.dataSetKey, this.props.onRow);
                break;
            case 'new':
                this.props.onNewData(attributeValues, this.props.dataSetKey, this.props.onRow);
                break;
            default:
                console.log("Unsupported operation: [" + this.props.operation + "]");
                break;
        }
    }

    onRecordDelete(row) {
        let object = this.state.data;

        if (object === null || object === undefined) {
            console.error("GenerateForm: onRecordDelete: atLevel: " + this.props.atLevel + ": Form object is null")
            return;
        }

        object.delete(row);

        this.onDataUpdate(object, this.props.dataSetKey, object);
    }

    /* Form Validation */
    /**
     * Checks if the given field (attr) has been
     * marked as in error for the "current stage"
     *
     * @param {*} attr
     */
    isError(attr) {
        if (this.state.attributesWithError === null && this.state.attributesWithError === undefined) return false;
        return this.state.attributesWithError.includes(attr);
    }

    markAsFailed(attr) {
        const { attributesWithError } = this.state;
        if (!attributesWithError.includes(attr)) {
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
    /* End Form Validation */
    valueLabelField(attribute, maxlength, attrValue, attrrequired, id) {
        return <Label style={{ display: 'block' }}>{attrValue}</Label>
    }

    inputFieldWithDefault(attribute, maxlength, attrValue, attrrequired, id) {

        let inputType = "text";
        if (maxlength > 100) {
            //return this.inputTextAreaFieldWithDefault(attribute, maxlength, attrValue, attrrequired, stageid);
            inputType = "textarea"
        } else if (maxlength === undefined) {
            maxlength = 30;
        }

        let attr = Util.firstCharacterLowerCase(attribute);

        let keyId = `${inputType}_${attr}_${this.props.atLevel}_${id}`;

        if (attrrequired === "required") {
            return <>
                <Input key={keyId} type={inputType} id={keyId} name={attr} maxLength={maxlength} size={maxlength.toString()} defaultValue={attrValue} required onBlur={(e) => { this.onChange(e) }} valid={!this.isError(attr)} invalid={this.isError(attr)} />
                <FormFeedback>You must specify a valid value for {attr}.</FormFeedback></>
        } else {
            return <Input key={keyId} type={inputType} id={keyId} name={attr} maxLength={maxlength} size={maxlength.toString()} defaultValue={attrValue} onBlur={(e) => { this.onChange(e) }} />
        }
    }

    inputFieldWithPlaceholder(attribute, maxlength, attrValue, attrrequired, id) {
        let attr = Util.firstCharacterLowerCase(attribute);

        let keyId = `text_${attr}_${this.props.atLevel}_${id}`;

        if (attrrequired === "required") {
            //Mark this field as invalid to ensure user has feedback to provide value
            this.markAsFailed(attr);
            return <>
                <Input key={keyId} type="text" id={keyId} name={attr} maxLength={maxlength} size={maxlength.toString()} placeholder={"Enter " + Util.makeDescription(attr)} required onBlur={(e) => { this.onChange(e) }} valid={!this.isError(attr)} invalid={this.isError(attr)} />
                <FormFeedback>You must specify a valid value for {attr}.</FormFeedback>
            </>

        } else {
            return <Input key={keyId} type="text" id={keyId} name={attr} maxLength={maxlength} size={maxlength.toString()} placeholder={"Enter " + Util.makeDescription(attr)} onBlur={(e) => { this.onChange(e) }} />
        }
    }

    getTextFormGroup(attr, attrrequired, maxlength, id, attrreadonly) {
        let av = this.getValue(attr);
        let attrValue = Util.isNullOrEmpty(av) ? "" : av;

        return <FormGroup key={`formGroup_${attr}_${this.props.atLevel}_${id}`} row>
            <Col sx="12" md="4" lg="4">
                <Label htmlFor={attr} style={{ display: 'block' }}><strong>{attr}: {attrrequired === "required" ? <font color="red">*</font> : null}</strong></Label>
            </Col>
            <Col sx="12" md="8" lg="8">
                {
                    attrreadonly ? this.valueLabelField(attr, maxlength, attrValue, attrrequired, id) :
                    this.props.isEditable === null || this.props.isEditable === undefined || this.props.isEditable ?
                        !Util.isNullOrEmpty(av) ?
                            this.inputFieldWithDefault(attr, maxlength, attrValue, attrrequired, id)
                            :
                            this.inputFieldWithPlaceholder(attr, maxlength, attrValue, attrrequired, id)
                        :
                        this.valueLabelField(attr, maxlength, attrValue, attrrequired, id)
                }
            </Col>
        </FormGroup>
    }

    getObjectFormGroup(object, attrs, formelements, id) {
        let data = object.properties;

        for (var attr in data) {
            let attrtype = object.properties[attr].type;
            let attrlength = data.hasOwnProperty("maxLength") ? object.properties[attr].maxLength : 0;
            let attrrequired = object.properties[attr].primaryKey ? "required" : "";
            let attrreadonly = object.readOnly;

            if (attrtype === 'string') {
                attrs.push(attr);
                formelements.push(this.getTextFormGroup(attr, attrrequired, attrlength === 0 ? 100 : attrlength, id, attrreadonly));
            } else if (attrtype === "object") {
                this.getObjectFormGroup(attr, attrs, formelements);
            }
        }
    }

    getObjectAttrsFormGroup(object, attrs) {
        let data = object.properties;

        for (var attr in data) {
            let attrtype = object.properties[attr].type;

            // eslint-disable-next-line
            let attrlength = data.hasOwnProperty("maxLength") ? object.properties[attr].maxLength : 0;

            // eslint-disable-next-line
            let attrrequired = object.properties.hasOwnProperty('primaryKey') ? [attr].primaryKey ? "required" : "" : "";

            if (attrtype === 'string') {
                attrs.push(attr);
            } else if (attrtype === "object") {
                this.getObjectFormGroup(attr, attrs);
            }
        }
    }

    getArrayFormGroup(objectName, objectData, object, attrs, arrayElements) {
        if (object === null || object === undefined) {
            return;
        }
        if (object.items === null || object.items === undefined) {
            return;
        }
        if (object.items.properties === null || object.items.properties === undefined) {
            return;
        }

        let data = object.items.properties;

        let requiredArray = object.items.required;

        let embeddedAttrs = [];
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
                this.getObjectFormGroup(attr, attrs, arrayElements);
            } else if (attrtype === 'array') {
                deeper = true;
                this.getArrayFormGroup(attr, embeddedAttrs, embeddedArrayElements);
            }
        }

        embeddedArraykey = requiredArray !== null && requiredArray !== undefined ? requiredArray[0] : "id";

        let attrValue = this.getValue(embeddedArraykey);

        let newRow = null;

        if (objectData !== null && objectData !== undefined && objectData.length === 0) {
            newRow = null;
        } else {
            try {
                newRow = objectData[0].makeNew();
            } catch (error) {
                newRow = {};
            }
        }

        // Handle main array
        arrayElements.push(
            <FormGroup key={Util.generateKey(objectName + "0")} row>
                <Col md="12">
                    <Label key={Util.generateKey(objectName + "2")} htmlFor={objectName} style={{ display: 'block' }}><strong>{objectName}: {attrValue}</strong></Label>
                </Col>
                <Col md="12">
                    <GenerateTable
                        forSchema={object.items}
                        dataSetKey={embeddedArraykey}
                        formTitle={objectName}
                        rowExpandComponent={deeper ? this : null}
                        isEditable={this.props.isEditable}
                        isFlatTable={false} // Follow JSON in schema and expand attributes of type "object"
                        atLevel={this.props.atLevel + 1}
                        withActions={true}
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

    }

    getValue(attr) {
        let attrValue = null;
        if (typeof (this.state.data) === 'object') {
            try {
                attrValue = this.state.data.get(Util.firstCharacterLowerCase(attr));
            } catch (exception) {
                attrValue = this.state.data[attr];
            }
        }
        else {
            attrValue = this.state.data[Util.firstCharacterLowerCase(attr)];
        }
        return attrValue;
    }

    formFromSchema() {
        let attrs = [];
        let data = this.props.forSchema.properties;
        let requiredArray = this.props.forSchema.required;

        let formelements = [];

        // eslint-disable-next-line
        let arrayElements = [];

        let ctr = 0;
        for (var attr in data) {
            ctr = ctr + 1;
            let attrtype = this.props.forSchema.properties[attr].type;
            let attrlength = this.props.forSchema.properties[attr].maxLength;
            //let attrrequired = this.props.forSchema.properties[attr].primaryKey ? "required" : "";
            let attrrequired = requiredArray !== null && requiredArray !== undefined && requiredArray.includes(attr) ? "required" : "";

            if (attrtype === 'string') {
                attrs.push(attr);
                formelements.push(this.getTextFormGroup(attr, attrrequired, attrlength === 0 ? 100 : attrlength, ctr));
            } else if (attrtype === "object") {
                this.getObjectFormGroup(this.props.forSchema.properties[attr], attrs, formelements);
            } else if (attrtype === 'array') {
                let thisObjectsData = this.state.data[Util.firstCharacterLowerCase(attr)];

                if (thisObjectsData === null || thisObjectsData === undefined || thisObjectsData.length === 0) {
                    try {
                        thisObjectsData = this.state.data.get(Util.firstCharacterLowerCase(attr));
                        if (thisObjectsData === null || thisObjectsData === undefined) {
                            if (typeof (thisObjectsData) === 'object') {
                                let elem = thisObjectsData[0];
                                if (elem === null || elem === undefined) {
                                    throw new Error("cannot find the right data");
                                } else {
                                    thisObjectsData = this.state.data[0].get(Util.firstCharacterLowerCase(attr));
                                    if (thisObjectsData === null || thisObjectsData === undefined) {
                                        throw new Error("cannot find the right data");
                                    }
                                }
                            }
                        }
                    } catch (Error) {

                    }
                }

                this.getArrayFormGroup(attr, thisObjectsData, this.props.forSchema.properties[attr], attrs, formelements);
            }
        }

        let attrValue = this.getValue(this.props.dataSetKey);

        if (this.props.atLevel <= 1) {
            let dataID = "level" + this.props.atLevel + "data";
            let dataSetKeyID = "level" + this.props.atLevel + "dataSetKey";
            let dataSetKeyValueID = "level" + this.props.atLevel + "dataSetKeyValue";

            return <Form id={`form_${this.props.atLevel}`} onSubmit={this.onSubmit}>
                <Card key={dataSetKeyValueID} className="w-100">
                    <CardHeader>
                        <strong>{this.props.dataSetKey}: </strong>{attrValue}
                    </CardHeader>
                    <CardBody>
                        {formelements}
                        <FormGroup row className="float-right">
                            <div className="input-group">
                                {this.state.dirtyElements.length > 0 ?
                                    <Button type="submit" size="md" color="primary">Save</Button>
                                    :
                                    <span />
                                }
                            </div>
                        </FormGroup>
                    </CardBody>
                </Card>
            </Form>
        } else {
            let dataSetKeyID = "level" + this.props.atLevel + "dataSetKey";
            let dataSetKeyValueID = "level" + this.props.atLevel + "dataSetKeyValue";

            return <Card key={dataSetKeyValueID} className="w-100">
                <CardHeader>
                    <strong>{this.props.dataSetKey}: {attrValue}</strong>
                </CardHeader>
                <CardBody>
                    {formelements}
                </CardBody>
            </Card>
        }

    }

    onChange(value) {
        let attrvals = this.state.attributeValues;
        let de = this.state.dirtyElements;

        de.push(value.target.id);

        if (!this.validateRequired(value)) {
            this.markAsFailed(value.target.id);
        } else {
            this.markValid(value.target.id);
        }

        let index = -1;
        let found = attrvals.filter(entry => {
            return entry.attributeName === value.target.id;
        });

        index = attrvals.indexOf(found);

        if (found.length > 0) {
            found[0].attributeValue = value.target.value;
            attrvals[index] = found;
        } else {
            let entry = {
                "attributeName": value.target.id,
                "attributeValue": value.target.value
            }

            attrvals.push(entry);
        }

        this.setState({ attributeValues: [...attrvals], dirtyElements: [...new Set(de)] });
    }

    render() {

        return (
            <React.Fragment>
                <div className="animated fadeIn w-100 d-inline-block justify-content-center">
                    {/*this.formFromSchema()*/}
                    <TypeCategoryForm values={this.props.data} {...this.props}/>
                </div>
            </React.Fragment>
        );

    }
}

GenerateForm.propTypes = {
    forSchema: PropTypes.object.isRequired,
    data: PropTypes.object.isRequired,
    atLevel: PropTypes.number,
    isEditable: PropTypes.bool,
    formTitle: PropTypes.string,
    operation: PropTypes.string,
    onRow: PropTypes.any,
    dataSetKey: PropTypes.string,
    onDataUpdate: PropTypes.func,
    onNewData: PropTypes.func,
    onRecordDelete: PropTypes.func,
};
