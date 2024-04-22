import React from 'react';
import { Modal as BootstrapModal, Button } from 'react-bootstrap';
import './Modal.css';
interface ModalProps {
  show: boolean;
  type: 'Upload' | 'Delete';
  formId: string;
  children?: React.ReactNode;
  loading?: boolean;
  size?: 'sm' | 'lg' | 'xl';
  isBodyCentered?: boolean;
  handleClose?: () => void;
  handleSubmit?: () => void;
  handleDelete?: () => void;
}
const Modal: React.FC<ModalProps> = ({
  show,
  type,
  formId,
  children,
  loading,
  size,
  isBodyCentered,
  handleClose,
  handleSubmit,
  handleDelete,
}) => {
  const createButtons = [
    <Button key="close" variant="secondary" onClick={handleClose}>
      Close
    </Button>,
    <Button key="submit" variant="primary" type="submit" form={formId} onClick={handleSubmit} disabled={loading}>
      Upload
    </Button>,
  ];

  const deleteButtons = [
    <Button key="close" variant="secondary" onClick={handleClose}>
      Close
    </Button>,
    <Button key="delete" variant="danger" onClick={handleDelete} disabled={loading}>
      Delete
    </Button>,
  ];

  const buttons = type === 'Upload' ? createButtons : deleteButtons;

  return (
    <BootstrapModal show={show} size={size} onHide={handleClose} backdrop="static" centered>
      <BootstrapModal.Header closeButton>
        <BootstrapModal.Title>{type} picture</BootstrapModal.Title>
      </BootstrapModal.Header>
      <BootstrapModal.Body className={`${isBodyCentered ? 'centered-modal-body' : ''}`}>{children}</BootstrapModal.Body>
      <BootstrapModal.Footer>{buttons}</BootstrapModal.Footer>
    </BootstrapModal>
  );
};

export default Modal;
