import PostsPage from "@/components/posts/pages/posts";
import ProtectedRoute from "@/components/Accounts/ProtectedRoutes";

export default function Posts() {
    return (
        <ProtectedRoute>
            <PostsPage/>
        </ProtectedRoute>
    );
}
