from django.urls import path
from .views import PostList, CreatePost

urlpatterns = [

    # The PostList class used for getting all the post 
    path('posts/', PostList.as_view(), name='post-list'),  
   
   # The CreatePost class used for creating a new post
    path('posts/create/', CreatePost.as_view(), name='post-create'),  

    # The CreateComment class used to show all comments and make comments
    #path('posts/<int:post_id>/comments/', CreateComment.as_view(), name='comment-list-create'),  
]
