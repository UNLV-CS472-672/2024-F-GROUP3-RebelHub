from rest_framework import generics
from rest_framework import status
from .models import Comment
from .serializers import CommentSerializer, CommentCreateSerializer, LikeCommentSerializer, DislikeCommentSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from Posts.models import Post
from rest_framework.exceptions import PermissionDenied, ValidationError
from django.db.models import Count
# Create your views here.
 
 # Creating a comment  
class CommentCreate(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentCreateSerializer

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']  
        comment_reply_id = self.request.data.get('comment_reply_id')
        serializer.save(author=self.request.user, post_id=post_id, comment_reply_id=comment_reply_id)
        
# Creating a reply       
class CommentReplyCreate(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer  
    def perform_create(self, serializer):
        comment_id = self.kwargs['comment_id']
        serializer.save(author=self.request.user, comment_reply_id=comment_id)
        
# Using to timestamp to order the comments or can order by most likes
class CommentList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    # Going to list by the most likes
    def get_queryset(self):
        post_id = self.kwargs['post_id']
        order_by = self.request.query_params.get('order_by', 'timestamp')
        
        if order_by == 'likes':
            return Comment.objects.filter(post_id=post_id, comment_reply__isnull=True).annotate(
                like_count=Count('likes')
            ).order_by('-like_count')
        return Comment.objects.filter(post_id=post_id, comment_reply__isnull=True).order_by('-timestamp')
        
# Get details for a single comment by ID
class CommentDetail(generics.RetrieveAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return get_object_or_404(Comment, id=self.kwargs['comment_id'])
 
# Delete a comment or reply
class CommentDelete(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    permission_classes = [IsAuthenticated]

    def get_object(self):
        comment = get_object_or_404(Comment, id=self.kwargs['comment_id'])
        
        # User neeeds to the author of the comment or reply
        if comment.author != self.request.user and comment.post.author != self.request.user:
            raise PermissionDenied("You do not have permission to delete this.")
        return comment       
       
# List for all replies from a comment, most recent reply is seen first
class CommentReplyList(generics.ListAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        comment_id = self.kwargs['comment_id']
        return Comment.objects.filter(comment_reply_id=comment_id).order_by('-timestamp')

# Note: Have  to test if the increment works correctly for likes and dislikes        
# Be able to like or dislike a comment based on the ID
class LikeComment(generics.UpdateAPIView):
    queryset = Comment.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = LikeCommentSerializer

    def patch(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id)
        
        # Likes are only for comments and not replies
        # Note: Likes and dislikes for replies might be implemented later
        if comment.comment_reply is not None:
            raise ValidationError("You cannot like a reply.")
        
        serializer = self.get_serializer(comment, data={}, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()   
        return Response({'likes': comment.likes.count(), 'dislikes': comment.dislikes.count()}, status=status.HTTP_200_OK)


class DislikeComment(generics.UpdateAPIView):
    queryset = Comment.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = DislikeCommentSerializer

    def patch(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id)

        # Dislikes are only for comments and not replies, but might be implemented later
        if comment.comment_reply is not None:
            raise ValidationError("You cannot dislike a reply.")
        
        serializer = self.get_serializer(comment, data={}, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'likes': comment.likes.count(), 'dislikes': comment.dislikes.count()}, status=status.HTTP_200_OK)
