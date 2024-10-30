from django.shortcuts import render
from rest_framework import generics, status
from .models import Post
from .serializers import PostSerializer, PostCreateSerializer, LikePostSerializer, DislikePostSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound
# Create your views here

# Able to create and view the post, should only handles POST requests to create a post
class CreatePost(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostCreateSerializer
    
        
# Delete the post by its ID
class PostDelete(generics.DestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = "id"
    def perform_destroy(self, instance):
        user = self.request.user
        if user != instance.author:
            if user != instance.hub.owner:
                raise PermissionDenied("Could Not Delete Post : You are not post author or hub owner")
        instance.delete()



# Able to view a list of all post, should only handles GET requests to Fetch a list of all post 
class PostList(generics.ListAPIView): 
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(hub__in=user.joined_hubs.all())

    

# Get the post by its ID or return a 404 error if not found
class LikePost(generics.UpdateAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = LikePostSerializer
    lookup_field = "id"

# Get the post by its ID or return a 404 error if not found
class DislikePost(generics.UpdateAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = DislikePostSerializer
    lookup_field = "id"

# GET a single post by its ID
class PostDetail(generics.RetrieveAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            qs = Post.objects.all()
        else:
            qs = Post.objects.filter(hub__private_hub=False)
        if qs is None:
            raise NotFound("No Post with this ID was found")
        return qs
