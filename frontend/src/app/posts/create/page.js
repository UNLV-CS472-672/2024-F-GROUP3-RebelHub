"use client";

import ProtectedRoute from "@/components/Accounts/ProtectedRoutes";
import CreatePostPage from "@/components/posts/pages/create-post";

/*
    This page is used to create a form to create a post.
*/

export default function CreatePost() {
    return (
        <ProtectedRoute>
            <CreatePostPage />
        </ProtectedRoute>
    );
}
