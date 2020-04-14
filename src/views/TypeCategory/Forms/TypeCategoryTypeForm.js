import React from "react";
import { Formik, Form } from "formik";
import * as Yup from "yup";

import { VField } from "../../Common/forms/FormUtils";
import { Card, CardHeader, CardBody } from "reactstrap";

export default class TypeCategoryTypeForm extends React.Component {
  constructor(props) {
    super(props);

    this.initialValues = this.props.data;

    this.validationSchema = Yup.object().shape({
      typeCode: Yup.string().required("TypeCode is required")
    });

    this.state = {};
  }

  render() {
    console.log(
      `InitialValues: ${JSON.stringify(this.initialValues, null, 2)}`
    );

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
            <CardHeader />
            <CardBody>
              <Form>
                <VField
                  name="typeCode"
                  errors={errors}
                  touched={touched}
                  value={this.initialValues.typeCode}
                />
                <VField
                  name="typeName"
                  errors={errors}
                  touched={touched}
                  value={this.initialValues.typeName}
                />
                <VField
                  name="typeDescription"
                  errors={errors}
                  touched={touched}
                  value={this.initialValues.typeDescription}
                />
                <VField
                  name="rightTypeCode"
                  errors={errors}
                  touched={touched}
                  value={this.initialValues.rightTypeCode}
                />
                <div className="form-group text-left">
                  <button type="submit" className="btn btn-primary mr-2">
                    Save
                  </button>
                  <button type="reset" className="btn btn-secondary">
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
