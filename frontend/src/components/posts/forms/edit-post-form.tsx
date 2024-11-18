"use client";

import { FormProvider, useForm } from "react-hook-form";
import CreateInput from "@/components/posts/forms/create-input";
import { TITLE_VALIDATION, POST_MESSAGE_VALIDATION } from "@/utils/posts/create-post-validations";
import { getEditPostUrl } from "@/utils/url-segments";
import styles from "./edit-post-form.module.css";
import api from "@/utils/api";
import { Post } from "@/utils/posts/definitions";

interface ComponentProps {
    post: Post;
    onClose: () => void;
    refreshComponent: () => void;
}

const EditPostForm: React.FC<ComponentProps> = ({ post, onClose, refreshComponent }) => {
    const methods = useForm();

    const onSubmit = methods.handleSubmit(async data => {
        try {

            /*
                Additional error checking beyond the basic validations can go here.
            */

            console.log("Editing a post");

            const response = await api.patch(getEditPostUrl(post.id), {
                title: data["title"],
                message: data["message"],
                last_edited: new Date(),
            });

            if (response.status != 200) {
                throw new Error("Error when editing a post");
            }

            methods.reset();

            // We need to update the object in case the user tries to edit the post again.
            // If they try to edit the post again and we don't change the client object,
            // then the original title/message will be displayed in the form.
            post.title = data["title"];
            post.message = data["message"];
            post.last_edited = new Date();

            // Instead of redirecting to a page, just use the function to refresh
            // the component of the post
            refreshComponent();

            onClose();

        } catch (error) {
            alert("There was an error in your edit: " + error);
            return null;
        }
    })

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={e => e.preventDefault()}
                noValidate
            >
                <div className={styles.editPostTitle}>
                    <h1>Edit Post '{post.title}'</h1>
                </div>
                <div className={styles.editPostContainer}>
                    <CreateInput {...{...TITLE_VALIDATION, 'startingValue': post.title}} />
                    <CreateInput {...{...POST_MESSAGE_VALIDATION, 'startingValue': post.message}} />
                
                    <div className={styles.editPostButtonContainer}>
                        <button className={styles.editConfirm} onClick={onSubmit}>
                            Submit Changes
                        </button>
                        <button className={styles.editCancel} onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default EditPostForm;
