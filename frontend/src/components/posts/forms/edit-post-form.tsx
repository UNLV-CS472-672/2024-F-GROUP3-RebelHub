"use client";

import { FormProvider, useForm } from "react-hook-form";
import CreateInput from "@/components/posts/forms/create-input";
import { TITLE_VALIDATION, POST_MESSAGE_VALIDATION } from "@/utils/posts/create-post-validations";
import { getEditPostUrl } from "@/utils/url-segments";
import styles from "./edit-post-form.module.css";
import api from "@/utils/api";
import { Post } from "@/utils/posts/definitions";
import { register } from "module";
import ImageInput from "./ImageInput";
import { headers } from "next/headers";

interface ComponentProps {
    post: Post;
    onClose: () => void;
    refreshComponent: () => void;
}

const EditPostForm: React.FC<ComponentProps> = ({ post, onClose, refreshComponent }) => {
    const methods = useForm({
        defaultValues: {
            title: post.title,
            message: post.message,
            image: post.image,
        }
    });

    const onSubmit = methods.handleSubmit(async data => {
        try {
            console.log("Editing a post");

            /*
                Additional error checking beyond the basic validations can go here.
            */

            /*
                Now make the form data object to send to the backend.
            */

            let formData = new FormData();
            
            // If the image was changed in the form, then add the image to the 
            // form data.
            if (data["image"] != null && data["image"][0] instanceof File) {
                formData.append("image", data["image"][0]);
            }

            formData.append("title", data["title"]);
            formData.append("message", data["message"]);
            formData.append("last_edited", new Date().toISOString());

            const response = await api.patch(getEditPostUrl(post.id), formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (response.status != 200) {
                throw new Error("Error when editing a post");
            }

            methods.reset();

            // We need to update the object in case the user tries to edit the post again.
            // If they try to edit the post again and we don't change the client object,
            // then the original title/message will be displayed in the form.
            post.title = response.data.title;
            post.message = response.data.message;
            post.last_edited = response.data.last_edited;
            post.image = response.data.image;

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
                    <ImageInput />

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
