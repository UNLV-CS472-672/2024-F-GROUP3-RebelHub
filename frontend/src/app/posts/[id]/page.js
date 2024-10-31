"use client";

import ProtectedRoute from "@/components/Accounts/ProtectedRoutes";
import DetailedPostPage from "@/components/posts/pages/detailed-post";

import { useParams } from "next/navigation";

/*
    This is a dynamic page that will display a different detailed page based on the URL.
*/

export default function DetailedPost() 
{
    // Use parameters in the URL to get the id of the specific post
    const id = useParams().id;

    return (
        <ProtectedRoute>
            <DetailedPostPage id={id}/>
        </ProtectedRoute>
    );
}
