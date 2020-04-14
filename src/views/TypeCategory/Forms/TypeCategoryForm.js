import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { VField } from "../../Common/forms/FormUtils";
import { Card, CardBody } from "reactstrap";

export default class TypeCategoryForm extends React.Component {
  constructor(props) {
    super(props);

    this.initialValues = props.data;

    this.validationSchema = Yup.object().shape({
      typeCategoryIdentifierText: Yup.string().required(
        "TypeCategoryIdentifierText is required"
      ),
      typeCategoryName: Yup.string().required("TypeCategoryName is required"),
      systemIdentifierText: Yup.string().required(
        "SystemIdentifierText is required"
      )
    });

    this.state = {};
  }

  render() {
    if (this.initialValues === null || this.initialValues === undefined)
      return <div />;

    return (
      <Formik
        initialValues={this.initialValues}
        validationSchema={this.validationSchema}
        onSubmit={values => {
          alert("SUCCESS!! :-)\n\n" + JSON.stringify(values));
        }}
      >
        {({ errors, status, touched }) => (
          <Card>
            <CardBody>
              <Form>
                <VField
                  name="typeCategoryIdentifierText"
                  errors={errors}
                  touched={touched}
                  defaultValue={this.initialValues.typeCategoryIdentifierText}
                  readOnly={this.props.readOnly}
                />
                <VField
                  name="typeCategoryName"
                  errors={errors}
                  touched={touched}
                  defaultValue={this.initialValues.typeCategoryName}
                  readOnly={this.props.readOnly}
                />
                <VField
                  name="systemIdentifierText"
                  errors={errors}
                  touched={touched}
                  defaultValue={this.initialValues.systemIdentifierText}
                  readOnly={this.props.readOnly}
                />
                <VField
                  name="typeCategoryDescription"
                  errors={errors}
                  touched={touched}
                  defaultValue={this.initialValues.typeCategoryDescription}
                  readOnly={this.props.readOnly}
                />
                <VField
                  name="rightSystemName"
                  errors={errors}
                  touched={touched}
                  defaultValue={this.initialValues.rightSystemName}
                  readOnly={this.props.readOnly}
                />
                <VField
                  name="defaultTypeCode"
                  errors={errors}
                  touched={touched}
                  defaultValue={this.initialValues.defaultTypeCode}
                  readOnly={this.props.readOnly}
                />
                <VField
                  name="rightTypeCategoryName"
                  errors={errors}
                  touched={touched}
                  defaultValue={this.initialValues.rightTypeCategoryName}
                  readOnly={this.props.readOnly}
                />
                {!this.props.readOnly ? (
                  <div className="form-group text-left">
                    <button type="submit" className="btn btn-primary mr-2">
                      Save
                    </button>
                    <button type="reset" className="btn btn-secondary mr-2">
                      Reset
                    </button>
                  </div>
                ) : null}
              </Form>
            </CardBody>
          </Card>
        )}
      </Formik>
    );
  }
}
