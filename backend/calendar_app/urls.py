from django.urls import path, include
from .views import EventList

urlpatterns = [
    path('api/events/', EventList.as_view(), name='event-list'),
]
