import React, { Component } from 'react';
import {
    Modal,
    ModalBody,
    ModalHeader,
} from 'reactstrap';

import PropTypes from 'prop-types';

import GenerateForm from './GenerateForm';

export default class PopupForm extends Component {
    static defaultProps = {
        forSchema: "",
        data: [],
        atLevel: 0,
        isEditable: false,
        formTitle: "",
        operation: "",
        onRow: null,
        dataSetKey: "",
        onDataUpdate: null,
        onNewData: null,
        onRecordDelete: null,
        onClose: null,
    }

    constructor(props) {
        super(props);

        this.toggle = this.toggle.bind(this);

        this.state = {
            sbsCollapse: false
        }
    }

    toggle() {
        this.setState({ sbsCollapse: !this.state.sbsCollapse });
    }

    close() {
        this.props.onClose && this.props.onClose();
    }

    render() {
        if (this.props.data === null || this.props.data === undefined || this.props.data.length === 0) {
            return <div />
        }

        return (<>
            <Modal isOpen={this.props.show} toggle={this.close.bind(this)} className="modal-xl modal-dialog-centered modal-dialog-scrollable">
                <ModalHeader toggle={this.close.bind(this)}>
                    {this.props.formTitle}
                </ModalHeader>

                <ModalBody>
                    <GenerateForm {...this.props} />
                </ModalBody>
            </Modal>
        </>
        );
    }
}

PopupForm.propTypes = {
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
