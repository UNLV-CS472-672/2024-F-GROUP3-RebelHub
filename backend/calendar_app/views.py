from rest_framework import generics
from .models import Event
from .serializers import EventSerializer

# Create your views here.
class EventList(generics.ListAPIView):
    queryset = Event.objects.all()
    serializer_class = EventSerializer
