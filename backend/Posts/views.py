from django.shortcuts import render
from rest_framework import generics
from .models import Post 
from .serializers import PostSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
# For handling HTTP requests in Django
from django.http import HttpResponse
# Used to send back any data in the HTTP response from our API view
# Create your views here.
class PostList(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
class CreatePost(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer

'''
# CreatePost handles any POST
class CreatePost(APIView):
    # Check to authenticated 
    permission_classes = [IsAuthenticated]  

    # POST method to create a new post
    def post(self, request):
        # The serializer with the incoming  data request
        serializer = PostSerializer(data=request.data)
        
        # Check if data is valid
        if serializer.is_valid():  
            # Save the post from the user and return a status that the post was created
            serializer.save(author=request.user)  
            return Response(serializer.data, status=status.HTTP_201_CREATED)  
        # If data is invalid then return ab error status
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)  

    # The GET method to get the post
    def get(self, request):
        # Get posts from the database
        posts = Post.objects.all()  
        # Then serialize the list of posts and return the serialized data
        serializer = PostSerializer(posts, many=True)  
        return Response(serializer.data)  
'''