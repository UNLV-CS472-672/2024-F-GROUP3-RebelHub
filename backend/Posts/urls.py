from django.urls import path
from .views import PostList, CreatPost

urlpatterns = [

    # The CreatePost class used for getting all the post and creating new post
    path('posts/', PostList.as_view(), name='post-list'),  
   
   # The CreatePost class used for getting all the post and creating new post
    path('posts/create/', CreatPost.as_view(), name='post-create'),  

    # The CreateComment class used to show all comments and make comments
    #path('posts/<int:post_id>/comments/', CreateComment.as_view(), name='comment-list-create'),  
]
