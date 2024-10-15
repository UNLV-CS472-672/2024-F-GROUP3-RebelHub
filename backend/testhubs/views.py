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


# Create your views here.


class DummyHubList(generics.ListAPIView):
    queryset = DummyHub.objects.all()
    serializer_class = DummyHubSerializer

class CreateComment(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, post_id):
        try:
            post = Post.objects.get(pk=post_id)
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
