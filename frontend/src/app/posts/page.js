"use client";

import PostsPage from "@/components/posts/pages/posts";
import ProtectedRoute from "@/components/Accounts/ProtectedRoutes";

/*
    This page displays the PostList component as well as the create post button.
*/

export default function Posts() {
    return (
        <ProtectedRoute>
            <PostsPage/>
        </ProtectedRoute>
    );
}
