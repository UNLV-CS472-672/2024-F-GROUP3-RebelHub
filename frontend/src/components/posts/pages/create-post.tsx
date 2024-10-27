"use client";

import { FormProvider, useForm } from "react-hook-form";
import CreatePostInput from "@/components/posts/create-post-input";
import { TITLE_VALIDATION, HUB_VALIDATION, POST_MESSAGE_VALIDATION } from "@/utils/posts/create-post-validations";
import { getCreatePostURL, URL_SEGMENTS } from "@/utils/posts/url-segments";
import styles from "../posts.module.css";
import api from "@/utils/api";
import { useRouter } from "next/navigation";

export default function CreatePostPage() {
    const methods = useForm();
    const router = useRouter();

    const onSubmit = methods.handleSubmit(async data => {
        try {
            console.log("Creating new post");

            // Author should be overwritten
            const response = await api.post(getCreatePostURL(), {
                title: data["title"],
                message: data["message"],
                timestamp: new Date(),
                hub: data["hub"],
                likes: 0,
                dislikes: 0,
                author: "create-post.tsx",
            });

            if (response.status != 201) {
                throw new Error("Error when creating a post");
            }

            methods.reset();

            router.push(URL_SEGMENTS.FRONTEND + URL_SEGMENTS.POSTS_HOME + response.data.id);

        } catch (error) {
            alert(error);
            return null;
        }
    })

    return (
        <FormProvider {...methods}>
            <form
                onSubmit={e => e.preventDefault()}
                noValidate
            >
                <div className={styles.createPostContainer}>
                    <CreatePostInput {...TITLE_VALIDATION} />
                    <CreatePostInput {...HUB_VALIDATION} />
                    <CreatePostInput {...POST_MESSAGE_VALIDATION} />
                
                    <div>
                        <button onClick={onSubmit}>Submit Post</button>
                    </div>
                </div>
            </form>
        </FormProvider>
    );
}