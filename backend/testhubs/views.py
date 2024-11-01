from django.shortcuts import render
from rest_framework import generics
from .models import DummyHub
from .serializers import DummyHubSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
# For handling HTTP requests in Django
from django.http import HttpResponse
# Used to send back any data in the HTTP response from our API view
# Create your views here.


class DummyHubList(generics.ListAPIView):
    queryset = DummyHub.objects.all()
    serializer_class = DummyHubSerializer