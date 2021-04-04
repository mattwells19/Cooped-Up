import * as React from "react";
import { Modal, ModalContent, ModalOverlay, ModalProps } from "@chakra-ui/react";

const BaseModal: React.FC<Partial<ModalProps>> = ({ children, onClose = () => null, isOpen = true, ...props }) => (
  <Modal onClose={onClose} isOpen={isOpen} isCentered closeOnOverlayClick={false} size="xl" {...props}>
    <ModalOverlay />
    <ModalContent containerProps={{ zIndex: 1401 }}>
      {children}
    </ModalContent>
  </Modal>
);

export default BaseModal;
