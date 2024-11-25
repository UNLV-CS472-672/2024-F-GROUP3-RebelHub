from django.shortcuts import render
from .models import *
from rest_framework import generics
from .serializers import *
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from .models import Hub

# Create your views here.

# Able to view a list of all hub tags
class HubTags(generics.ListAPIView): 
    serializer_class = HubTagsSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        return Hub_Tag.objects.all()
    
# GET a single tag by its ID
class HubTag(generics.RetrieveAPIView):
    serializer_class = HubTagsSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        id = self.kwargs.get('id')

        # Find hub tag using its id
        try:
            return Hub_Tag.objects.get(id=id)
        except Hub_Tag.DoesNotExist:
            raise NotFound("Cannot Find Hub Tag")
        
# Assign a hub tag to a hub
class HubTagAssign(generics.GenericAPIView):
    serializer_class = HubTagAssignSerializer
    permission_classes = [IsAuthenticated]

# "api/tags/<hub_id>"
# returns all the post tags for a hub.
class PostTags(generics.ListAPIView):
    serializer_class = PostTagsSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "hub_id"

    def get_queryset(self):
        hub_id = self.kwargs.get('hub_id')
        try:
            this_hub = Hub.objects.get(id=hub_id)
        except Hub.DoesNotExist:
            raise NotFound("Cannot List Tags: Hub not found")

        user = self.request.user
        if this_hub.private_hub and user not in this_hub.members.all():
            raise PermissionDenied("Cannot List Tags: Hub is private")

        return Post_Tag.objects.filter(hub=this_hub)
    
# GET a single post tag by its ID
class PostTag(generics.RetrieveAPIView):
    serializer_class = PostTagsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        id = self.kwargs.get('id')

        # Find tag using its id
        try:
            return Post_Tag.objects.get(id=id)
        except Post_Tag.DoesNotExist:
            raise NotFound("Cannot Find Post Tag")
    
# Able to create a post tag
class PostTagCreate(generics.CreateAPIView): 
    queryset = Post_Tag.objects.all()
    serializer_class = PostTagCreateSerializer
    permission_classes = [IsAuthenticated]

# Delete the post tag by its ID
class PostTagDelete(generics.DestroyAPIView):
    serializer_class = PostTagsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        id = self.kwargs.get('id')

        # Find tag using its id
        try:
            return Post_Tag.objects.get(id=id)
        except Post_Tag.DoesNotExist:
            raise NotFound("Cannot Delete Tag: Cannot find it")
        
    def perform_destroy(self, instance):
        user = self.request.user
        if user != instance.hub.owner:
            if user not in instance.hub.mods.all():
                raise PermissionDenied("Could Not Delete Tag: You are not hub owner, or a hub moderator")
        instance.delete()

