"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import DeleteModal from "../modals/delete-modal";
import { getDeletePostURL, URL_SEGMENTS } from "@/utils/posts/url-segments";
import styles from "./post-buttons.module.css";
import api from "@/utils/api";
import { usePathname, useRouter } from "next/navigation";

interface ComponentProps {
    postTitle: string,
    id: number|string,
}

const DeletePostButton: React.FC<ComponentProps> = ({ postTitle, id }) => {
    const [showModal, setShowModal] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const deletePost = async (postId: number|string) => {
        try {
            console.log("Delete post " + postId);
            const response = await api.delete(getDeletePostURL(postId));

            if (response.status != 204) {
                throw new Error("Error when posting a delete post");
            }

            console.log("Deleted " + postId);
            setShowModal(false);

            /*
                This if statement determines where to redirect the user on deletion.
                If they are on a detailed post, we need to redirect them.
                If they are somewhere else, we refresh the page.
            */

            if (pathname == "/" + URL_SEGMENTS.POSTS_HOME + id + "/") {
                router.push(URL_SEGMENTS.FRONTEND + URL_SEGMENTS.POSTS_HOME);
            } else {
                window.location.reload()
            }

        } catch (error) {
            console.log("Error deleting a post: " + postId + error);
        }
    }

    // Uses javascript to decide whether or not to show the modal

    return (
        <div>
            <button className={styles.basicButton} onClick={() => setShowModal(true)}>
                Delete Post
            </button>
            {showModal && createPortal(
                <DeleteModal 
                    warningMessage={"Are you sure you want to delete the post '" + postTitle +"'?"}
                    deleteButtonName="Delete Post"
                    cancelButtonName="Cancel" 
                    id={id} 
                    deleteFunction={deletePost} 
                    onClose={() => setShowModal(false)}
                />, 
                document.body
            )}
        </div>
    )
}

export default DeletePostButton;