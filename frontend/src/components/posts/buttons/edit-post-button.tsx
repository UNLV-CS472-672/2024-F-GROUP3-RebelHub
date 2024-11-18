"use client"

import { Post } from "@/utils/posts/definitions";
import EditPostModal from "../modals/edit-post-modal";
import { useEffect, useState } from "react";
import styles from "./post-buttons.module.css"
import { createPortal } from "react-dom";
import { checkAuthorPrivileges, checkHubPrivileges } from "@/utils/fetchPrivileges";

interface ComponentProps {
    post: Post;
    refreshComponent: () => void;
}

/*
    This component should be conditionally rendered using the helper
    methods from fetchPrivileges.js
*/

const EditPostButton: React.FC<ComponentProps> = ({ post, refreshComponent }) => {
    const [showModal, setShowModal] = useState(false);

    return (
        <div>
            <button className={styles.basicButton} onClick={() => setShowModal(true)}>
                Edit Post
            </button>
            {showModal && createPortal(
                <EditPostModal 
                    post={post} 
                    onClose={() => setShowModal(false)} 
                    refreshComponent={refreshComponent}
                />,
                document.body
            )}
        </div>
    );
}

export default EditPostButton;
