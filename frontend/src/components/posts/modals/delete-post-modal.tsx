import React, { useEffect, useCallback } from "react";
import styles from "../posts.module.css";

interface ComponentProps {
    id: number|string,
    deleteFunction: (id: number|string) => void,
    onClose: () => void,
}

const DeletePostModal: React.FC<ComponentProps> = ({ id, deleteFunction, onClose }) => {
    const modalWrapperRef = React.useRef();

    // Function to check if user clicked outside the modal
    const backDropHandler = useCallback(e => {
        if (!modalWrapperRef?.current?.contains(e.target)) {
            onClose();
        }
    }, []);

    // Wait for the modal to load before adding the background click exit
    useEffect(() => {
        setTimeout(() => {
            window.addEventListener('click', backDropHandler);
        });
    }, []);

    // Removes the background click event listener
    useEffect(() => {
        return () => window.removeEventListener('click', backDropHandler);
    }, []);

    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    };

    return (
        <div className={styles.deleteModalOverlay}>
            <div ref={modalWrapperRef}>
                <div className={styles.deleteModal}>
                    <div className={styles.deleteModalClose}>
                        <a href="#" className={styles.deleteModalClose} onClick={handleCloseClick}>
                            x
                        </a>
                    </div>
                    <div className={styles.deleteModalHeader}>
                        Are you sure you want to delete post {id}?
                    </div>
                    <div className={styles.deleteModalConfirm}>
                        <button className={styles.deleteModalConfirm} onClick={() => deleteFunction(id)}>Delete Post</button>
                    </div>
                    <div className={styles.deleteModalCancel}>
                        <button className={styles.deleteModalCancel} onClick={onClose}>Cancel</button>
                    </div>
                </div>    
            </div>
        </div>
    );
}

export default DeletePostModal;