from django.urls import path
from .views import PostList, CreatePost, LikePostView, DislikePostView

urlpatterns = [

    # The PostList class used for getting all the post (GET) 
    path('posts/', PostList.as_view(), name='post-list'),  
   
   # The CreatePost class used for creating a new post (POST)
    path('posts/create/', CreatePost.as_view(), name='post-create'),  
    
    # Endpoint for liking and disliking a post. Frontend can send requests to the correct URL when a user interacts with the like or dislike buttons.
    path('posts/<int:post_id>/like/', LikePostView.as_view(), name='like-post'),  # Endpoint for liking a post
    path('posts/<int:post_id>/dislike/', DislikePostView.as_view(), name='dislike-post'),  # Endpoint for disliking a post
]
