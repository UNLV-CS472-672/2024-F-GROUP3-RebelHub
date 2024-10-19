from django.shortcuts import render
from rest_framework import generics
from .models import Hub
from .serializers import HubSerializer, HubUpdateSerializer, HubCreateSerializer
# Create your views here.

# "api/hubs/"
class HubList(generics.ListAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubSerializer

# "api/hubs/<id>/"
class HubByID(generics.RetrieveAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubSerializer
    lookup_field = "id"



# "api/hubs/create/"
# a hub name
# a hub description
# and a user id corresponding to the hub owner is needed in
# the request.
class HubCreate(generics.CreateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubCreateSerializer

    def perform_create(self, serializer):
        serializer.save()



# "api/hubs/<id>/update/"
# hub name and hub description can be updated.
# a user_id is also needed in the request to validate it's an owner making the update.
class HubUpdate(generics.UpdateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubUpdateSerializer
    lookup_field = "id"


# "api/hubs/<id>/delete/"
class HubDelete(generics.DestroyAPIView):
    serializer_class = HubSerializer
    lookup_field = "id"

    def get_queryset(self):
        return Hub.objects.filter(owner=self.request.user)
