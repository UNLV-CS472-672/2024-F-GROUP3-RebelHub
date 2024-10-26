import ProtectedRoute from "@/components/Accounts/ProtectedRoutes";
import DetailedPostPage from "@/components/posts/pages/detailed-post";

export default async function DetailedPost({ params, }: { params: Promise<{ id: string }> }) 
{
    // Use parameters in the URL to get the id of the specific post
    const id = (await params).id;

    return (
        <ProtectedRoute>
            <DetailedPostPage id={id}/>
        </ProtectedRoute>
    );
}
