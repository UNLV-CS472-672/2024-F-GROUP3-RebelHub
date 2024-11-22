from django.shortcuts import render
from .models import Tags
from rest_framework import generics
from .serializers import GlobalTagsSerializer, HubTagsSerializer, HubTagCreateSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from .models import Hub

# Create your views here.

# Able to view a list of all tags
class GlobalTags(generics.ListAPIView): 
    serializer_class = GlobalTagsSerializer
    permission_classes = [AllowAny]
    def get_queryset(self):
        return Tags.objects.filter(isGlobal=True)
    
# GET a single tag by its ID
class GlobalTag(generics.RetrieveAPIView):
    serializer_class = GlobalTagsSerializer
    permission_classes = [AllowAny]

    def get_object(self):
        id = self.kwargs.get('id')

        # Find tag using its hub_id and id
        try:
            return Tags.objects.get(id=id, isGlobal=True)
        except Tags.DoesNotExist:
            raise NotFound("Cannot Find Global Tag")
    
# "api/tags/<hub_id>"
# returns all the tags for a hub.
class HubTags(generics.ListAPIView):
    serializer_class = HubTagsSerializer
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

        return Tags.objects.filter(hub=this_hub)
    
# GET a single hub tag by its ID
class HubTag(generics.RetrieveAPIView):
    serializer_class = HubTagsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        hub_id = self.kwargs.get('hub_id')
        id = self.kwargs.get('id')

        # Find tag using its hub_id and id
        try:
            return Tags.objects.get(id=id, hub__id=hub_id)
        except Tags.DoesNotExist:
            raise NotFound("Cannot Find Hub Tag")
    
# Able to create a global tag
class HubTagCreate(generics.CreateAPIView): 
    queryset = Tags.objects.all()
    serializer_class = HubTagCreateSerializer
    permission_classes = [IsAuthenticated]

# Delete the post by its ID
class HubTagDelete(generics.DestroyAPIView):
    serializer_class = HubTagsSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        hub_id = self.kwargs.get('hub_id')
        id = self.kwargs.get('id')

        # Find tag using its hub_id and id
        try:
            return Tags.objects.get(id=id, hub__id=hub_id)
        except Tags.DoesNotExist:
            raise NotFound("Cannot Delete Tag: Cannot find it")
        
    def perform_destroy(self, instance):
        user = self.request.user
        if user != instance.hub.owner:
            if user not in instance.hub.mods.all():
                raise PermissionDenied("Could Not Delete Tag: You are not hub owner, or a hub moderator")
        instance.delete()

