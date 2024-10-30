from django.urls import path
from .views import CommentList, CommentCreate, LikeComment, DislikeComment

urlpatterns = [
    # Used to get the all comments (GET), and create comments (POST)
    path('comments/', CommentList.as_view(), name='comment-list'),
    path('comments/create/', CommentCreate.as_view(), name='comment-create'),
    
    # Endpoints for liking and disliking a comment using buttons from the  frontend
    path('comments/<int:comment_id>/like/', LikeComment.as_view(), name='like-comment'),
    path('comments/<int:comment_id>/dislike/', DislikeComment.as_view(), name='dislike-comment'),
]
