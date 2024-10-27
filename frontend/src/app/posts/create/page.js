"use client";

import ProtectedRoute from "@/components/Accounts/ProtectedRoutes";
import CreatePostPage from "@/components/posts/pages/create-post"

export default function CreatePost() {
    return (
        <ProtectedRoute>
            <CreatePostPage/>
        </ProtectedRoute>
    );
}
