from django.urls import path
from .views import DummyHubList, CreateComment, CreatePost

urlpatterns = [
    path('api/dummyhubs/', DummyHubList.as_view(), name='dummy-hub-list'),

    # The CreatePost class used for getting all the post and creating new post
    path('posts/', CreatePost.as_view(), name='post-list'),  
   
    # The CreateComment class used to show all comments and make comments
    path('posts/<int:post_id>/comments/', CreateComment.as_view(), name='comment-list-create'),  
]
