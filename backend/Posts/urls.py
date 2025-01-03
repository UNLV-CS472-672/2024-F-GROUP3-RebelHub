from django.urls import path
from .views import PostList, CreatePost, LikePost, DislikePost, PostDetail, PostDelete, ExploreList, PostEdit, UserPostCountAPIView, UserPostsView, PostTag

urlpatterns = [

    # The PostList class used for getting all the post (GET) 
    path('posts/', PostList.as_view(), name='post-list'),  
   
    # The CreatePost class used for creating a new post (POST)
    path('posts/create/', CreatePost.as_view(), name='post-create'),  
    
    # Endpoints for liking and disliking a post. Frontend can send requests to the correct URL when a user interacts with the like or dislike buttons.
    path('posts/<int:id>/like/', LikePost.as_view(), name='like-post'), 
    path('posts/<int:id>/dislike/', DislikePost.as_view(), name='dislike-post'),
    
    # Endpoints for retrieving a single post by its ID (GET) and  deleting a post by its ID (DELETE)
    path('posts/<int:id>/', PostDetail.as_view(), name='post-detail'),
    path('posts/<int:id>/delete/', PostDelete.as_view(), name='post-delete'),

    # Endpoints for retrieving a list of posts for the explore page (with optional filters and sorting)
    path('posts/explore/', ExploreList.as_view(), name='explore-list'),
    # Endpoint for editing a post by its ID
    path('posts/<int:id>/edit/', PostEdit.as_view(), name='post-edit'),

    # Endpoint for updating a post tag for a post
    path('posts/<int:id>/tag/', PostTag.as_view(), name='post-tag'),

    path('posts/postcount/<str:username>/', UserPostCountAPIView.as_view(), name='post-count'),
    path('posts/<str:username>/', UserPostsView.as_view(), name='user_posts')

]
