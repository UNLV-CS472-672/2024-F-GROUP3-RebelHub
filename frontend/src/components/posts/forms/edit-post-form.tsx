"use client";

import { FormProvider, useForm } from "react-hook-form";
import CreateInput from "@/components/posts/forms/create-input";
import { TITLE_VALIDATION, POST_MESSAGE_VALIDATION } from "@/utils/posts/create-post-validations";
import { gotoDetailedPostPage, URL_SEGMENTS, getEditPostUrl } from "@/utils/url-segments";
import styles from "./edit-post-form.module.css";
import api from "@/utils/api";
import { usePathname, useRouter } from "next/navigation";
import { Post } from "@/utils/posts/definitions";

interface ComponentProps {
    post: Post;
    onClose: () => void;
}

const EditPostForm: React.FC<ComponentProps> = ({ post, onClose }) => {
    const methods = useForm();
    const pathname = usePathname();
    const router = useRouter();

    const onSubmit = methods.handleSubmit(async data => {
        try {

            /*
                Additional error checking beyond the basic validations can go here.
            */

            console.log("Editing a post");

            const response = await api.patch(getEditPostUrl(post.id), {
                title: data["title"],
                message: data["message"],
            });

            if (response.status != 200) {
                throw new Error("Error when editing a post");
            }

            methods.reset();

            // If the user is on the post they are editing, reload the page so they can see the
            // changes.
            // Else, send them to the edited page
            if (pathname == "/" + URL_SEGMENTS.POSTS_HOME + response.data.id + "/") {
                window.location.reload();
            } else {
                router.push(gotoDetailedPostPage(response.data.id));
            }

        } catch (error) {
            alert("There was an error in your edit: " + error);

            // If the post was deleted while someone was editing it, reload the page
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
