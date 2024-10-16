from django.shortcuts import render
from rest_framework import generics
from .models import DummyHub
from .serializers import DummyHubSerializer
from .models import Post 
from .models import Comment
from .serializers import CommentSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
# For handling HTTP requests in Django
from django.http import HttpResponse
# Used to send back any data in the HTTP response from our API view
# Create your views here.


class DummyHubList(generics.ListAPIView):
    queryset = DummyHub.objects.all()
    serializer_class = DummyHubSerializer

# CommentView handles the comment requests for the post
class CreateComment(APIView):
    permission_classes = [IsAuthenticated]
     # A POST method to create a new comment for the post by getting the ID
    def post(self, request, post_id):
        try:
            post = Post.objects.get(pk=post_id)
            
            # Error message if post post doesn't exist
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Use serializer with the request data
        serializer = CommentSerializer(data=request.data)
        
        # Check if data is valid
        if serializer.is_valid():  
            # Save the comment from the user under the post if data is valid
            serializer.save(author=request.user, post=post)  
            return Response(serializer.data, status=status.HTTP_201_CREATED)  
        # If the data is invalid, then return an error
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # This GET method is to get all comments for the post
    def get(self, request, post_id):
        # First fetch the post by its ID
        try:
            post = Post.objects.get(pk=post_id)  
            
            # Error message if post doesn't exist
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND) 

        # Then get all comments related to this post
        comments = Comment.objects.filter(post=post)
        
        # Serialize the comment data and return to client
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)  