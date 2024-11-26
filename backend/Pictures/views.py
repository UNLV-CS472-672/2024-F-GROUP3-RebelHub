from django.shortcuts import render
from hubs.models import User
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Picture, Post
from rest_framework.response import Response
from .serializers import PictureSerializer
from rest_framework import status
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination


class AddPictureToPostView(APIView):
    def post(self, request, post_id):
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            return Response({"detail": "Post not found"}, status=status.HTTP_404_NOT_FOUND)

        picture_serializer = PictureSerializer(data=request.data)
        if picture_serializer.is_valid():
            picture = picture_serializer.save(post=post)
            return Response(PictureSerializer(picture).data, status=status.HTTP_201_CREATED)
        else:
            return Response(picture_serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        


class PicturePagination(PageNumberPagination):
    page_size = 9  
    page_size_query_param = 'page_size' 
    max_page_size = 100 

class UserPicturesView(APIView):
    def get(self, request, username):
        user = get_object_or_404(User, username=username) 
        pictures = Picture.objects.filter(user=user).order_by('-timestamp')

        paginator = PicturePagination() 
        paginated_pictures = paginator.paginate_queryset(pictures, request)

        serializer = PictureSerializer(paginated_pictures, many=True)

        return paginator.get_paginated_response(serializer.data)