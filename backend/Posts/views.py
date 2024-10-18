from django.shortcuts import render
from rest_framework import generics
from .models import Post
from .serializers import PostSerializer
from rest_framework.permissions import IsAuthenticated
# Create your views here

# Able to view a list of all post, should only handles GET requests
class PostList(generics.ListAPIView):
    # Returns a list of all posts through the fetch process   
    queryset = Post.objects.all()
    # Using the PostSerializer to format the output as JSON for frontend consumption
    serializer_class = PostSerializer
    
 # Able to create and view the post, should only handles POST requests.  
class CreatePost(generics.CreateAPIView):
    queryset = Post.objects.all()
    # Uses the PostSerializer to validate the incoming request data and create a post
    serializer_class = PostSerializer
    
    # A definition to associate the post with the logged-in user. Note: The "user" is just a placeholder name as it hasn't been made yet
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)  
