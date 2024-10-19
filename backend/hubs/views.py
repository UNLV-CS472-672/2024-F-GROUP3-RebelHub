from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Hub
from .serializers import HubSerializer, HubUpdateSerializer, HubCreateSerializer

# "api/hubs/"
class HubList(generics.ListAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubSerializer
    permissions_classes = [AllowAny]

# "api/hubs/<id>/"
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
    permission_classes = [AllowAny]#[IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

# "api/hubs/<id>/update/"
# hub name and hub description can be updated.
# user has to be authenticated with token in header.
class HubUpdate(generics.UpdateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubUpdateSerializer
    permission_classes = [AllowAny]#[IsAuthenticated]
    lookup_field = "id"

    def perform_update(self, serializer):
        serializer.save()

# "api/hubs/<id>/delete/"
class HubDelete(generics.DestroyAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubSerializer
    permission_classes = [AllowAny]#[IsAuthenticated]
    lookup_field = "id"

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            raise PermsissionDenied("Cannot Delete Hub : No Permissons To Delete This Hub")
        else:
            instance.delete()
