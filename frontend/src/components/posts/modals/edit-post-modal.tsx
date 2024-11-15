"use client"

import { Post } from "@/utils/posts/definitions";
import Modal from "react-modal";
import styles from "./edit-post-modal.module.css";
import EditPostForm from "../forms/edit-post-form";

interface ComponentProps {
    post: Post;
    onClose: () => void;
    changeFields: (title: string, message?: string) => void;
}

const EditPostModal: React.FC<ComponentProps> = ({ post, onClose, changeFields }) => {
    const handleCloseClick = (e) => {
        e.preventDefault();
        onClose();
    }

    return (
        <Modal
            isOpen={true}
            overlayClassName={styles.editModalOverlay}
            className={styles.editModal}
            ariaHideApp={false}
        >
            <div className={styles.editModalClose}>
                <a href="#" onClick={handleCloseClick}>
                    X
                </a>
            </div>
            <EditPostForm post={post} onClose={onClose} changeFields={changeFields}/> 
        </Modal>
    );
}

export default EditPostModal;
