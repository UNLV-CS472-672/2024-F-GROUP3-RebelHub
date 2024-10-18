from django.shortcuts import render
from rest_framework import generics, status
from .models import Post
from .serializers import PostSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
# Create your views here

# Able to create and view the post, should only handles POST requests to create a post
class CreatePost(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

# Able to view a list of all post, should only handles GET requests to Fetch a list of all post 
class PostList(generics.ListAPIView): 
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
    # A definition to associate the post with the logged-in user. Note: The "user" is just a placeholder name as it hasn't been made yet
    def perform_create(self, serializer):
        serializer.save(author=self.request.user)  

# Get the post by its ID or return a 404 error if not found
class LikePost(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        post.likes += 1 
        post.save()
        
        return Response({ 'likes': post.likes, 'dislikes': post.dislikes}, status=status.HTTP_200_OK)

# Get the post by its ID or return a 404 error if not found
class DislikePost(generics.GenericAPIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, post_id):
        post = get_object_or_404(Post, id=post_id)
        post.dislikes += 1  
        post.save()
        
        return Response({ 'likes': post.likes, 'dislikes': post.dislikes}, status=status.HTTP_200_OK)
    
# GET a single post by its ID
class PostDetail(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        post_id = self.kwargs['post_id']
        return get_object_or_404(Post, id=post_id)
    
# Delete the post by its ID
class PostDelete(generics.DestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]

    def get_object(self):
        post_id = self.kwargs['post_id']
        return get_object_or_404(Post, id=post_id)