from django.shortcuts import render
from rest_framework import generics
from .models import DummyHub
from .serializers import DummyHubSerializer

# Create your views here.


class DummyHubList(generics.ListAPIView):
    queryset = DummyHub.objects.all()
    serializer_class = DummyHubSerializer
