from rest_framework import generics
from .models import Event
from .serializers import *
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import PermissionDenied

# Create your views here.
class EventList(generics.ListAPIView):
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        personal_events = Event.objects.filter(isPersonal=True, author=user)
        hub_events = Event.objects.filter(isPersonal=False, hub__members=user)
        return personal_events | hub_events
    
class EventCreate(generics.CreateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

class EventUpdate(generics.UpdateAPIView):
    queryset = Event.objects.all()
    serializer_class = EventUpdateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def perform_update(self, serializer):
        serializer.save()

class EventDelete(generics.DestroyAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def perform_destroy(self, instance):
        user = self.request.user
        if (instance.isPersonal and instance.author != user) or (not instance.isPersonal and (instance.hub.owner != user and user not in instance.hub.mods.all())):
            raise PermissionDenied("Cannot Delete Event : No Permissons To Delete This Event")
        else:
            instance.delete()
