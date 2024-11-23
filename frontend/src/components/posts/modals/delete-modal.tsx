import React from "react";
import styles from "./delete-modal.module.css";
import Modal from "react-modal";

interface ComponentProps {
    warningMessage: string,
    deleteButtonName: string,
    cancelButtonName: string
    id: number|string,
    deleteFunction: (id: number|string) => void,
    onClose: () => void,
}

const DeleteModal: React.FC<ComponentProps> = ({ warningMessage, deleteButtonName, cancelButtonName, id, deleteFunction, onClose }) => {
    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    };

    return (
        <Modal
            isOpen={true}
            onRequestClose={onClose}
            overlayClassName={styles.deleteModalOverlay}
            className={styles.deleteModal}
            ariaHideApp={false}
        >
            <div className={styles.deleteModal}>
                <div className={styles.deleteModalClose}>
                    <a href="#" onClick={handleCloseClick}>
                        X
                    </a>
                </div>
                <div className={styles.deleteModalMessage}>
                    {warningMessage}
                </div>
                <div className={styles.deleteModalButtonContainer}>
                    <div>
                        <button className={styles.deleteModalConfirm} onClick={() => deleteFunction(id)}>{deleteButtonName}</button>
                    </div>
                    <div>
                        <button className={styles.deleteModalCancel} onClick={onClose}>{cancelButtonName}</button>
                    </div>
                </div>
            </div>    
        </Modal>
    );
}

export default DeleteModal;