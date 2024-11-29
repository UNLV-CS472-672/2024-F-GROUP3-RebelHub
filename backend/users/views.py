from django.shortcuts import get_object_or_404, render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, UserPublicInfoSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny


# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        # Get access to current user
        user = self.request.user
        return user


# api/users/<id>/info
class UserPublicInfoView(generics.RetrieveAPIView):
    serializer_class = UserPublicInfoSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"
    queryset = User.objects.all()
