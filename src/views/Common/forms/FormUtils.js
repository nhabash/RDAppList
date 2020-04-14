import React from "react";
import { Field, FieldArray } from "formik";
import { Col, FormGroup, Label, CardHeader, CardBody, Card } from "reactstrap";

import Util from "../Util";

export const VFieldValidationMessage = props => {
  const { name, errors, touched } = props;

  let _touched = touched && touched[name];
  let _errors = errors && errors[name];

  return (
    <>
      {_errors && _touched ? (
        <div>
          <small>
            <font color="red">{_errors}</font>
          </small>
        </div>
      ) : null}
    </>
  );
};

export const VField = props => {
  let extraProps = {};

  const { name, type, errors, touched, value, component } = props;

  if (type) {
    extraProps["type"] = type;
  } else {
    extraProps["type"] = "text";
  }

  value && (extraProps["defaultValue"] = value);
  component && (extraProps["component"] = component);

  let _touched = touched && touched[name];
  let _errors = errors && errors[name];

  console.log(`VField: props = [${JSON.stringify(extraProps)}]`);

  return (
    <>
      <FormGroup row>
        <Col className="text-left" sm="4">
          <Label htmlFor={name}>
            <strong>
              {Util.makeDescription(Util.firstCharacterUpperCase(name))}
            </strong>
          </Label>
        </Col>
        <Col className="text-left" sm="8">
          <Field
            name={name}
            className={
              "form-control" + (_errors && _touched ? " is-invalid" : "")
            }
            {...extraProps}
          />
          <VFieldValidationMessage
            name={name}
            errors={errors}
            touched={touched}
          />
        </Col>
      </FormGroup>
    </>
  );
};

export const TextAreaInput = ({ field, form, ...props }) => {
  return <textarea maxLength="200" size="200" {...field} {...props} />;
};

export const VArrayField = props => {
  const {
    name,
    values,
    type,
    errors,
    touched,
    onAddItem,
    onDeleteItem
  } = props;
  let arrayObject = values[name];

  return (
    <FieldArray
      name={name}
      render={({ insert, remove, push }) => (
        <div>
          <Card>
            <CardHeader>
              <strong>{Util.firstCharacterUpperCase(name)}</strong>
              <div className="card-header-actions">
                <button
                  id="new"
                  type="button"
                  className="card-header-action btn btn-new"
                  onClick={() => onAddItem && onAddItem()}
                >
                  <i className="fa fa-dot-circle-o" /> Add{" "}
                  {Util.firstCharacterUpperCase(name)}
                </button>
              </div>
            </CardHeader>
            <CardBody>
              <div
                style={{
                  height: "300px",
                  overflowX: "hidden",
                  overflowY: "auto"
                }}
              >
                {arrayObject.length > 0 &&
                  arrayObject.map((obj, index) => (
                    <Card
                      key={`card_type_${index}`}
                      style={{ background: "#FBF3BE" }}
                    >
                      <CardHeader>
                        <strong>Type.typeCode: {obj.typeCode}</strong>
                        <div className="card-header-actions">
                          <button
                            id={`delete_btn_${index}`}
                            type="button"
                            className="card-header-action btn btn-new"
                            onClick={() => {
                              onDeleteItem && onDeleteItem(index);
                            }}
                          >
                            <i className="fa fa-trash" /> Remove{" "}
                            {Util.firstCharacterUpperCase(name)}
                          </button>
                        </div>
                      </CardHeader>
                      <CardBody>
                        <VField
                          name="typeCode"
                          type={type}
                          errors={errors}
                          touched={touched}
                          value={obj.typeCode}
                        />
                        <VField
                          name="typeName"
                          type="textarea"
                          errors={errors}
                          touched={touched}
                          value={obj.typeName}
                          component={TextAreaInput}
                        />
                        <VField
                          name="typeDescription"
                          type="textarea"
                          errors={errors}
                          touched={touched}
                          value={obj.typeDescription}
                          component={TextAreaInput}
                        />
                        <VField
                          name="rightTypeCode"
                          type={type}
                          errors={errors}
                          touched={touched}
                          value={obj.rightTypeCode}
                        />
                      </CardBody>
                    </Card>
                  ))}
              </div>
            </CardBody>
          </Card>
        </div>
      )}
    />
  );
};
