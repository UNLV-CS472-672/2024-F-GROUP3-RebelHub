from django.urls import path
from .views import *

urlpatterns = [
    # Used for getting all hub tags (GET) 
    path('tags/hubtags/', HubTags.as_view(), name='hub-tags'),
    # Used for getting a hub tag (GET) 
    path('tags/hubtags/<int:id>/', HubTag.as_view(), name='get-hub-tag'),
    # Used for assiging or unassigning hub tags (PUT) 
    # Used for getting all hub tags for a hub (GET)
    path('tags/hubtags/hub/<int:hub_id>/', HubTagsForAHub.as_view(), name='get-hub-tags-for-a-hub'),
    # Used for getting all post tags for a hub (GET) 
    path('tags/list/<int:hub_id>/', PostTags.as_view(), name='post-tags'),
    # Used for getting a single post tag for a hub (GET) 
    path('tags/<int:id>/', PostTag.as_view(), name='get-post-tag'),
    # Used for creating a post tag for a hub (POST) 
    path('tags/create/', PostTagCreate.as_view(), name='post-tag-create'),
    # Used for deleting a post tag for a hub (DELETE) 
    path('tags/<int:id>/delete/', PostTagDelete.as_view(), name='hub-tag-delete'),
]
