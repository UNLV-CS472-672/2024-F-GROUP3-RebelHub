"use client";

import { FormProvider, useForm } from "react-hook-form";
import CreateInput from "@/components/posts/forms/create-input";
import { TITLE_VALIDATION, POST_MESSAGE_VALIDATION } from "@/utils/posts/create-post-validations";
import { getAddPictureToPostUrl, getDeletePictureInPostUrl, getEditPictureInPostUrl, getEditPostUrl } from "@/utils/url-segments";
import styles from "./edit-post-form.module.css";
import api from "@/utils/api";
import { Post } from "@/utils/posts/definitions";
import ImageInput from "./ImageInput";
import bStyles from "@/components/posts/buttons/post-buttons.module.css"
import { useState } from "react";

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
            image: (post.pictures.length > 0 ? post.pictures[0][1] : null),
        }
    });

    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const onSubmit = methods.handleSubmit(async data => {
        try {
            console.log("Editing a post");

            // If the post was unchanged and user clicked submit, just close the form
            if (data["title"] == post.title && data["message"] == post.message) {
                if (post.pictures.length > 0 && data["image"] == post.pictures[0][1]) {
                    onClose();
                    return null;
                } else if (post.pictures.length == 0 && data["image"] == null) {
                    onClose();
                    return null;
                }
            }

            /*
                Additional error checking beyond the basic validations can go here.
            */

            /*
                Make form data for post.
            */

            const postData = new FormData();

            postData.append("title", data["title"]);
            postData.append("message", data["message"]);
            postData.append("last_edited", new Date().toISOString());

            const postResponse = await api.patch(getEditPostUrl(post.id), postData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (postResponse.status != 200) {
                throw new Error("Error when editing a post");
            }

            /*
                Make form data for picture.
            */

            // Case where picture doesn't exist and we want to make one
            if (post.pictures.length <= 0 && data["image"] != null && data["image"][0] instanceof File) {
                const picData = new FormData();

                picData.append("image", data["image"][0])

                const picResponse = await api.post(getAddPictureToPostUrl(postResponse.data.id), picData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (picResponse.status != 201) {
                    throw new Error("Error when creating a post image");
                }

                post.pictures[0] = [picResponse.data.id, picResponse.data.image_url];
            }
            // Case where picture exists and we want to change it
            else if (post.pictures.length > 0 && data["image"] != null && data["image"][0] instanceof File) {
                const picData = new FormData();

                picData.append("image", data["image"][0]);

                const picResponse = await api.patch(getEditPictureInPostUrl(post.pictures[0][0]), picData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (picResponse.status != 200) {
                    throw new Error("Error when editing a post image");
                }

                post.pictures[0][1] = picResponse.data.image_url;
            }
            // Case where picture exists and we want to delete it
            else if (post.pictures.length > 0 && data["image"] == null) {
                const picResponse = await api.delete(getDeletePictureInPostUrl(post.pictures[0][0]));

                if (picResponse.status != 204) {
                    throw new Error("Error when deleting a post image");
                }

                post.pictures = [];
            }

            methods.reset();

            // We need to update the object in case the user tries to edit the post again.
            // If they try to edit the post again and we don't change the client object,
            // then the original title/message will be displayed in the form.
            post.title = postResponse.data.title;
            post.message = postResponse.data.message;
            post.last_edited = postResponse.data.last_edited;

            // Instead of redirecting to a page, just use the function to refresh
            // the component of the post
            refreshComponent();

            onClose();

        } catch (error) {
            alert("There was an error in your edit: " + error);

            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.detail || "Inappropriate language detected. Please refrain from using inappropriate language");
            } else if (error.status == 404) {
                window.location.reload();
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
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
                <div className={styles.editPostTitle}>
                    <h1>Edit Post '{post.title}'</h1>
                </div>
                <div className={styles.editPostContainer}>
                    {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
                    <CreateInput {...TITLE_VALIDATION} />
                    <CreateInput {...POST_MESSAGE_VALIDATION} />
                    <ImageInput />
                
                    <div className={styles.editPostButtonContainer}>
                        <button className={bStyles.genericConfirm} onClick={onSubmit}>
                            Submit Changes
                        </button>
                        <button className={bStyles.genericCancel} onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default EditPostForm;
