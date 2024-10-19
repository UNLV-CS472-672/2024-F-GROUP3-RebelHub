from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Hub
from .serializers import HubSerializer, HubUpdateSerializer, HubCreateSerializer, HubAddMemberSerializer

# "api/hubs/"
# returns all the hubs.
class HubList(generics.ListAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubSerializer
    permissions_classes = [AllowAny]

# "api/hubs/<id>/"
# returns one hub corresponding to ID in request.
class HubByID(generics.RetrieveAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubSerializer
    permissions_classes = [AllowAny]
    lookup_field = "id"

# "api/hubs/create/"
# a hub name
# a hub description
# user has to be authenticated with token in header.
class HubCreate(generics.CreateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

# "api/hubs/<id>/update/"
# hub name and hub description can be updated.
# user has to be authenticated with token in header.
class HubUpdate(generics.UpdateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubUpdateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def perform_update(self, serializer):
        serializer.save()

# "api/hubs/<id>/delete/"
# user making request must be owner of hub.
class HubDelete(generics.DestroyAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            raise PermsissionDenied("Cannot Delete Hub : No Permissons To Delete This Hub")
        else:
            instance.delete()


# "api/hubs/<id>/join/"
# user making request wants to join hub <id>
# user must be authenticated and not already a member
class HubAddMember(generics.UpdateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubAddMemberSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"
