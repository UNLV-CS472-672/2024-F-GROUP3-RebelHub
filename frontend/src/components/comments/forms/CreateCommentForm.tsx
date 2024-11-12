"use client";

import CreateInput from "@/components/posts/forms/create-input";
import api from "@/utils/api";
import { COMMENT_VALIDATION } from "@/utils/comments/CreateCommentValidations";
import { Post, PostComment } from "@/utils/posts/definitions";
import { getCreateCommentsUrl, getCreateReplyUrl } from "@/utils/url-segments";
import { FormProvider, useForm } from "react-hook-form";
import styles from "./CreateCommentForm.module.css";

interface ComponentProps {
    post: Post;
    onClose: () => void;
    commentReply: PostComment;
}

const CreateCommentForm: React.FC<ComponentProps> = ({ post, onClose, commentReply=null }) => {
    const methods = useForm();

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

            // Reload the page so the user can see their comment/reply

            window.location.reload();

        } catch (error) {
            alert("There was an error in your comment: " + error);
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
                    <CreateInput {...COMMENT_VALIDATION} />
                    
                    <div className={styles.commentButtonContainer}>
                        <button onClick={onSubmit} className={styles.commentConfirm}>
                            Create Comment
                        </button>
                        <button onClick={onClose} className={styles.commentCancel}>
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default CreateCommentForm;
