import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { VField } from "../../Common/forms/FormUtils";
import { Card, CardHeader, CardBody } from "reactstrap";

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
                  value={this.initialValues.typeCategoryIdentifierText}
                />
                <VField
                  name="typeCategoryName"
                  errors={errors}
                  touched={touched}
                  value={this.initialValues.typeCategoryName}
                />
                <VField
                  name="systemIdentifierText"
                  errors={errors}
                  touched={touched}
                  value={this.initialValues.systemIdentifierText}
                />
                <VField
                  name="typeCategoryDescription"
                  errors={errors}
                  touched={touched}
                  value={this.initialValues.typeCategoryDescription}
                />
                <VField
                  name="rightSystemName"
                  errors={errors}
                  touched={touched}
                  value={this.initialValues.rightSystemName}
                />
                <VField
                  name="defaultTypeCode"
                  errors={errors}
                  touched={touched}
                  value={this.initialValues.defaultTypeCode}
                />
                <VField
                  name="rightTypeCategoryName"
                  errors={errors}
                  touched={touched}
                  value={this.initialValues.rightTypeCategoryName}
                />
                <div className="form-group text-left">
                  <button type="submit" className="btn btn-primary mr-2">
                    Save
                  </button>
                  <button type="reset" className="btn btn-secondary mr-2">
                    Reset
                  </button>
                </div>
              </Form>
            </CardBody>
          </Card>
        )}
      </Formik>
    );
  }
}
