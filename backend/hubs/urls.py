from django.urls import path
from .views import HubList, HubByID, HubCreate, HubUpdate, HubDelete

urlpatterns = [
        path('hubs/', HubList.as_view(), name='hub-list'),
        path('hubs/<int:id>/', HubByID.as_view(), name='hub-by-id'),
        path('hubs/create/', HubCreate.as_view(), name='hub-create'),
        path('hubs/<int:id>/delete/', HubDelete.as_view(), name='hub-delete'),
        path('hubs/<int:id>/update/', HubUpdate.as_view(), name='hub-update'),
]
