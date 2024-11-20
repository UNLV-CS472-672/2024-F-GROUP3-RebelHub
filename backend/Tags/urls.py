from django.urls import path
from .views import GlobalTags, HubTags, HubTagCreate, HubTagDelete, HubTag

urlpatterns = [
    # Used for getting all global tags (GET) 
    path('tags/global/', GlobalTags.as_view(), name='tags-global'),
    # Used for getting all tags for a hub (GET) 
    path('tags/<int:hub_id>/', HubTags.as_view(), name='tags-hub'),
    # Used for getting a single hub (GET) 
    path('tags/<int:hub_id>/<int:id>', HubTag.as_view(), name='get-hub-tag'),
    # Used for creating a hub tag (POST) 
    path('tags/<int:hub_id>/create/', HubTagCreate.as_view(), name='tags-hub-create'),
    # Used for deleting a global tag (DELETE) 
    path('tags/<int:hub_id>/delete/<int:id>', HubTagDelete.as_view(), name='tags-hub-delete'),
]
