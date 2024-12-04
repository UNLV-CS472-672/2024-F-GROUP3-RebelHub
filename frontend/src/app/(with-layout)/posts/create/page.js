"use client";

import ProtectedRoute from "@/components/Accounts/ProtectedRoutes";
import CreatePostPage from "@/components/posts/pages/create-post";
import Sidebar from "@/components/sidebar/sidebar";
import RebelHubNavBar from "@/components/navbar/RebelHubNavBar";

import margins from "@/utils/Margins.module.css";

/*
    This page is used to create a form to create a post.
*/

export default function ProtectedCreatePost() {
    return (
        <ProtectedRoute>
            <div>
                <CreatePostPage/>
            </div>
        </ProtectedRoute>
    );
}
