"use client";

import CreateInput from "@/components/posts/forms/create-input";
import api from "@/utils/api";
import { COMMENT_VALIDATION } from "@/utils/comments/CreateCommentValidations";
import { Post, PostComment } from "@/utils/posts/definitions";
import { getCreateCommentsUrl, getCreateReplyUrl } from "@/utils/url-segments";
import { FormProvider, useForm } from "react-hook-form";
import styles from "./CreateCommentForm.module.css";
import bStyles from "@/components/posts/buttons/post-buttons.module.css";
import { useState } from "react";

interface ComponentProps {
    post: Post;
    onClose: () => void;
    commentReply: PostComment;
    parentCreate: (create: PostComment) => void;
}

/*
    CreateCommentForm

    The form that creates a comment or a reply.

    post: the post that the comment is being posted on
    onClose: the function used to hide the dummy CreateComment component
    commentReply: the comment that another comment is replying to. By default, it is null to represent a comment directly on a post
    parentCreate: the function used to update a comment list without refreshing the page
*/

const CreateCommentForm: React.FC<ComponentProps> = ({ post, onClose, commentReply=null, parentCreate }) => {
    const methods = useForm();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = methods.handleSubmit(async data => {
        try {

            /*
                Additional error checking beyond basic validations go here
            */

            console.log("Creating a comment");

            let response;

            if (commentReply != null) {
                //This comment is a reply to a comment
                response = await api.post(getCreateReplyUrl(commentReply.id), {
                    message: data['message'],
                    post_id: post.id,
                });
            } else {
                //This comment is directly on a post
                response = await api.post(getCreateCommentsUrl(post.id), {
                    message: data['message'],
                    post_id: post.id,
                });
            }

            if (response.status != 201) {
                throw new Error("Error when creating a comment");
            }

            methods.reset();
            setErrorMessage(null);
            // Use function to add comment to the hooks
            parentCreate(response.data);
            onClose();

        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                // Check for backend error messages
                setErrorMessage(error.response.data.detail || "Inappropriate language detected.");
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
            }

            
            console.log(error);

            //If the comment's reply/post was deleted, reload the page
            if (error.status == 404) {
                window.location.reload();
            }

            return null;
        }
    })

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={e => e.preventDefault()}
                noValidate
            >
                <div className={styles.commentInputContainer}>
                    {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
                    
                    <CreateInput {...COMMENT_VALIDATION} />
                    
                    <div className={styles.commentButtonContainer}>
                        <button onClick={onSubmit} className={bStyles.genericConfirm}>
                            Create Comment
                        </button>
                        <button onClick={onClose} className={bStyles.genericCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default CreateCommentForm;
