"use client"

import { Post } from "@/utils/posts/definitions";
import EditPostModal from "../modals/edit-post-modal";
import { useEffect, useState } from "react";
import styles from "./post-buttons.module.css"
import { createPortal } from "react-dom";
import { checkAuthorPrivileges, checkHubPrivileges } from "@/utils/fetchPrivileges";

interface ComponentProps {
    post: Post;
    changeFields: (title: string, message?: string) => void;
}

/*
    This component should be conditionally rendered using the helper
    methods from fetchPrivileges.js
*/

const EditPostButton: React.FC<ComponentProps> = ({ post, changeFields }) => {
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
                    changeFields={changeFields}
                />,
                document.body
            )}
        </div>
    );
}

export default EditPostButton;
