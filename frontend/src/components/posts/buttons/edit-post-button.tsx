"use client"

import { Post } from "@/utils/posts/definitions";
import EditPostModal from "../modals/edit-post-modal";
import { useState } from "react";
import styles from "./post-buttons.module.css"
import { createPortal } from "react-dom";

interface ComponentProps {
    post: Post,
}

const EditPostButton: React.FC<ComponentProps> = ({ post }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <button className={styles.basicButton} onClick={() => setShowModal(true)}>
                Edit Post
            </button>
            {showModal && createPortal(
                <EditPostModal post={post} onClose={() => setShowModal(false)}/>,
                document.body
            )}
        </div>
    );
}

export default EditPostButton;
