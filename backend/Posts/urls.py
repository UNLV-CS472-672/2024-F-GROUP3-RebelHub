from django.urls import path
from .views import PostList, CreatePost

urlpatterns = [

    # The PostList class used for getting all the post (GET) 
    path('posts/', PostList.as_view(), name='post-list'),  
   
   # The CreatePost class used for creating a new post (POST)
    path('posts/create/', CreatePost.as_view(), name='post-create'),  
]
