from django.urls import path
from .views import EventList, EventCreate, EventUpdate, EventDelete

urlpatterns = [
    # Used for getting all events (GET) 
    path('api/events/', EventList.as_view(), name='event-list'),
    # Used for creating a new post (POST)
    path('api/events/create/', EventCreate.as_view(), name='event-create'),  

    path('api/events/<int:id>/update/', EventUpdate.as_view(), name='event-update'),
    path('api/events/<int:id>/delete/', EventDelete.as_view(), name='event-delete'),
]
