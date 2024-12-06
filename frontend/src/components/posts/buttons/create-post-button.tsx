"use client";

import Link from "next/link";
import styles from "./post-buttons.module.css"
import { gotoCreatePostPage } from "@/utils/url-segments";

interface ComponentProps {
    hubId?: number|null;
    buttonStyle?: string|null;
}

const CreatePostButton: React.FC<ComponentProps> = ({ hubId=null, buttonStyle=null }) => {
    const addHubId = () => {
        if (hubId != null) {
            localStorage.setItem("hubId", hubId.toString());
        }
    }

    return (
        <div>
            <Link href={gotoCreatePostPage()} onClick={addHubId}>
                <button className={buttonStyle != null ? buttonStyle : styles.basicButton} type="button">
                    CREATE POST
                </button>
            </Link>
        </div>
    );
}

export default CreatePostButton;
