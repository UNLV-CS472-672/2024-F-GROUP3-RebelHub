"use client";

import { useState } from "react";
import styles from "./post-buttons.module.css";
import TagModal from "../modals/tag-modal.js";

/*
    This component should be conditionally rendered using the helper
    methods from fetchPrivileges.js
*/

const TagPostButton = ({ post, refreshComponent }) => {
    const [showModal, setShowModal] = useState(false);
    // Uses javascript to decide whether or not to show the modal

    return (
        <div>
            <button className={styles.basicButton} onClick={() => setShowModal(true)}>
                Tag Post
            </button>
            {showModal && 
                <TagModal 
                    post={post} 
                    hub={post.hub}
                    onClose={() => setShowModal(false)}
                    refreshComponent={refreshComponent}
                />
            }
        </div>
    )
}

export default TagPostButton;
