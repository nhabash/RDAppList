import React from 'react';
import {
  Button,
  Modal,
  ModalBody,
  ModalHeader,
  ModalFooter,
} from 'reactstrap';

export const AppModal = ({ showModal, handleClose, handleAction, actionLabel, titleMessage, bodyMessage, modalRedirect }) => {

  return (
    <Modal isOpen={showModal} toggle={handleClose}>
      <ModalHeader toggle={handleClose}>
        {titleMessage}
      </ModalHeader>
      <ModalBody>{bodyMessage}</ModalBody>
      <ModalFooter>
        {handleAction ? <Button variant="danger" onClick={handleAction(modalRedirect)}>{actionLabel}</Button> : (null)}
        <Button variant="primary" onClick={handleClose}>Close</Button>
      </ModalFooter>
    </Modal>
  )
}
