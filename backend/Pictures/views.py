from django.shortcuts import render
from hubs.models import User
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Picture, Post
from rest_framework.response import Response
from .serializers import CreatePostPictureSerializer, PictureSerializer
from rest_framework import status, generics
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.pagination import PageNumberPagination


class AddPictureToPostView(generics.CreateAPIView):
    queryset = Picture.objects.all()
    serializer_class = CreatePostPictureSerializer
    parser_classes = (MultiPartParser, FormParser)

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context['post_id'] = self.kwargs['post_id']
        return context


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
