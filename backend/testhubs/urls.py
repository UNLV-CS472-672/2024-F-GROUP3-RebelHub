from django.urls import path
from .views import DummyHubList, CreateComment, CreatePost

urlpatterns = [
    path('api/dummyhubs/', DummyHubList.as_view(), name='dummy-hub-list'),
]
