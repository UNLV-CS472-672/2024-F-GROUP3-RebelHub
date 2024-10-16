from django.urls import path
from .views import CommentList, CommentCreate

urlpatterns = [

    # The CommentList class used for getting all the post 
    path('api/comments/', CommentList.as_view(), name='comment-list'),  
   
   # The CommentCreate class used for creating new post
    path('api/comments/create/', CommentCreat.as_view(), name='comment-create'),  
 
    # The CreateComment class used to show all comments and make comments
    #path('posts/<int:post_id>/comments/', CreateComment.as_view(), name='comment-list-create'),  
]
