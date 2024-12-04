"use client";

import ProtectedRoute from "@/components/Accounts/ProtectedRoutes";
import RebelHubNavBar from "@/components/navbar/RebelHubNavBar";
import DetailedPostPage from "@/components/posts/pages/detailed-post";
import Sidebar from "@/components/sidebar/sidebar";

import { useParams } from "next/navigation";

import margins from "@/utils/Margins.module.css";

/*
    This is a dynamic page that will display a different detailed page based on the URL.
*/

export default function ProtectedDetailedPost() {
    const id = useParams().id;

    return (
        <ProtectedRoute>
            <div>
                <DetailedPostPage id={id}/>
            </div>
        </ProtectedRoute>
    );
}
