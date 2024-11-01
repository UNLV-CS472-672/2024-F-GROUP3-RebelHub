from django.urls import path
from .views import CommentList, CommentCreate, LikeComment, DislikeComment, CommentDetail,  CommentReplyList, CommentReplyCreate

urlpatterns = [
    # Used to get the all comments (GET), and create comments (POST)
    path('posts/<int:post_id>/comments/', CommentList.as_view(), name='comment-list'),
    path('posts/<int:post_id>/comments/create/', CommentCreate.as_view(), name='comment-create'),
    
    # Used for getting, updating, or deleting a comment
    path('comments/<int:comment_id>/', CommentDetail.as_view(), name='comment-detail'),

    # Endpoints for liking and disliking a comment using buttons from the frontend
    path('comments/<int:comment_id>/like/', LikeComment.as_view(), name='like-comment'),
    path('comments/<int:comment_id>/dislike/', DislikeComment.as_view(), name='dislike-comment'),
    
    # Used for replies to a comment 
    path('posts/<int:post_id>/comments/', CommentReplyList.as_view(), name='comment-list-create'),
    path('comments/<int:comment_id>/reply/', CommentReplyCreate.as_view(), name='comment-reply-create'),
]
