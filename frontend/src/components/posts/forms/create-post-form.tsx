"use client";

import { FC, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CreateInput from "@/components/posts/forms/create-input";
import { TITLE_VALIDATION, POST_MESSAGE_VALIDATION } from "@/utils/posts/create-post-validations";
import styles from "./create-post-form.module.css";
import { getAddPictureToPostUrl, getCreatePostUrl, URL_SEGMENTS } from "@/utils/url-segments";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import HubInput from "./create-input-hub";
import ImageInput from "./ImageInput";
import bStyles from "@/components/posts/buttons/post-buttons.module.css";

const CreatePostForm: FC = () => {
    const methods = useForm({
        defaultValues: {
            title: "",
            message: "",
            image: null,
        }
    });
    const [errorMessage, setErrorMessage] = useState<string | null>(null);
    
    const router = useRouter();

    const onSubmit = methods.handleSubmit(async data => {
        try {

            /*
                Additional error checking beyond the basic validations can go here.
            */

            // There needs to be a hub in the form.
            if (!data["hub_id"]) {
                throw new Error("There is no hub selected for the post to go.");
            }

            /*
                Make form data for post
            */

            const postData = new FormData();
            
            postData.append("title", data["title"]);
            postData.append("message", data["message"]);
            postData.append("hub_id", data["hub_id"]);

            console.log("Creating new post");

            const postResponse = await api.post(getCreatePostUrl(), postData, {
                headers : {
                    "Content-Type": "multipart/form-data",
                },
            });

            if (postResponse.status != 201) {
                throw new Error("Error when creating a post");
            }

            /*
                Make form data for picture
            */

            if (data["image"] != null && data["image"][0] instanceof File){
                const picData = new FormData();

                picData.append("image", data["image"][0]);

                const picResponse = await api.post(getAddPictureToPostUrl(postResponse.data.id), picData, {
                    headers : {
                        "Content-Type": "multipart/form-data",
                    },
                });

                if (picResponse.status != 201) {
                    throw new Error("Error when creating picture for post");
                }
            }

            methods.reset();
            setErrorMessage(null);
            // Try to send the user to the newly created post
            router.push(URL_SEGMENTS.FRONTEND + URL_SEGMENTS.POSTS_HOME + postResponse.data.id);

        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                setErrorMessage(error.response.data.detail || "Inappropriate language detected. Please refrain from using inappropriate language");
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
            }

            console.error(error);
            return null;
        }
    })

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={e => e.preventDefault()}
                noValidate
            >
                <div className={styles.title}>
                    <h1>Create a Post</h1>
                </div>
                <div className={styles.createPostContainer}>
                    {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>}
                    <CreateInput {...TITLE_VALIDATION} />
                    <HubInput />
                    <CreateInput {...POST_MESSAGE_VALIDATION} />
                    <ImageInput />
                
                    <div className={styles.createPostButtonContainer}>
                        <button className={bStyles.genericConfirm} onClick={onSubmit}>
                            Submit Post
                        </button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default CreatePostForm;
