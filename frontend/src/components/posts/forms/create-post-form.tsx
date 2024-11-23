"use client";

import { FC } from "react";
import { FormProvider, useForm } from "react-hook-form";
import CreateInput from "@/components/posts/forms/create-input";
import { TITLE_VALIDATION, POST_MESSAGE_VALIDATION } from "@/utils/posts/create-post-validations";
import styles from "./create-post-form.module.css";
import { getCreatePostUrl, URL_SEGMENTS } from "@/utils/url-segments";
import api from "@/utils/api";
import { useRouter } from "next/navigation";
import HubInput from "./create-input-hub";

const CreatePostForm: FC = () => {
    const methods = useForm();
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

            console.log("Creating new post");

            const response = await api.post(getCreatePostUrl(), {
                title: data["title"],
                message: data["message"],
                hub_id: data["hub_id"],
            });

            if (response.status != 201) {
                throw new Error("Error when creating a post");
            }

            methods.reset();

            // Try to send the user to the newly created post
            router.push(URL_SEGMENTS.FRONTEND + URL_SEGMENTS.POSTS_HOME + response.data.id);

        } catch (error) {
            alert("There was an error in your post: " + error);
            return null;
        }
    })

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={e => e.preventDefault()}
                noValidate
            >
                <div style={{textAlign: "center", marginTop: "10px"}}>
                    <h1>Create A Post</h1>
                </div>
                <div className={styles.createPostContainer}>
                    <CreateInput {...TITLE_VALIDATION} />
                    <HubInput/>
                    <CreateInput {...POST_MESSAGE_VALIDATION} />
                
                    <div className={styles.createPostButtonContainer}>
                        <button className={styles.createPostButton} onClick={onSubmit}>
                            Submit Post
                        </button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}

export default CreatePostForm;
