from rest_framework import generics
from rest_framework import status
from .models import Comment
from .serializers import CommentSerializer, CommentCreateSerializer, LikeCommentSerializer, DislikeCommentSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from Posts.models import Post
from rest_framework.exceptions import PermissionDenied
# Create your views here.
   
# Create a comment for the specific post
class CommentCreate(generics.CreateAPIView):
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        post_id = self.kwargs['post_id']
        post = get_object_or_404(Post, id=post_id)
        serializer.save(author=self.request.user, post=post) 

# Retrieve single comment based on ID
class CommentDetail(generics.RetrieveAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        comment_id = self.kwargs['comment_id']
        return get_object_or_404(Comment, id=comment_id)

# Delete a comment
class CommentDelete(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        comment = get_object_or_404(Comment, id=self.kwargs['comment_id'])
        if comment.author != self.request.user and comment.post.author != self.request.user:
            raise PermissionDenied("Only able to delete comments that you have made.")
        return comment
    
# Using to timestamp to order the comments 
class CommentList(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = CommentSerializer

    # Going to list by the most likes
    def get_queryset(self):
        post_id = self.kwargs['post_id']
        return Comment.objects.filter(post_id=post_id).order_by('-likes') 

        
# Note: Have  to test if the increment works correctly for likes and dislikes        
# Be able to like or dislike a comment based on the ID
class LikeComment(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LikeCommentSerializer

    def post(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id)
        serializer = self.get_serializer(comment, data={}, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'likes': comment.likes.count(), 'dislikes': comment.dislikes.count()}, status=status.HTTP_200_OK)

class DislikeComment(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DislikeCommentSerializer

    def post(self, request, comment_id):
        comment = get_object_or_404(Comment, id=comment_id)
        serializer = self.get_serializer(comment, data={}, context={'request': request})
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response({'likes': comment.likes.count(), 'dislikes': comment.dislikes.count()}, status=status.HTTP_200_OK)
