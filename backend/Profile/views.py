from django.shortcuts import render
from hubs.models import User
from django.shortcuts import get_object_or_404
from django.core.exceptions import ObjectDoesNotExist
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .models import Profile
from rest_framework.response import Response
from .serializers import ProfileSerializer
from rest_framework import status


import logging


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self,request):
        user = request.user
        profile = Profile.objects.get(user=user)
        hub_count = profile.hubs_count
        return Response({
            'username': user.username,
            'bio': profile.bio,
            'pfp': profile.pfp.url,
            'name': profile.name,
            'hubs_count': hub_count
        })
    
    def put(self, request):

        profile = request.user.profile  
        profile_serializer = ProfileSerializer(profile, data=request.data, partial=True)

        if profile_serializer.is_valid():
            profile_serializer.save()  
            return Response(profile_serializer.data)

        return Response(profile_serializer.errors, status=status.HTTP_400_BAD_REQUEST)