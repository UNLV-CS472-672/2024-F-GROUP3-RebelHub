from django.urls import path
from .views import DummyHubList

urlpatterns = [
    path('api/dummyhubs/', DummyHubList.as_view(), name='dummy-hub-list'),
]
