from django.urls import path
from .views import HubList, HubJoined, HubModerating, HubOwned, HubByID, HubCreate, HubUpdate, HubDelete, HubAddMember, HubAddPendingMember, HubAddMemberFromPending, HubRemoveMember, HubRemovePendingMember, HubRemoveMemberFromPending, HubAddModerator, HubRemoveModerator, HubKickMember, HubPosts, FilterHubs

urlpatterns = [
        path('hubs/', HubList.as_view(), name='hub-list'),
        path('hubs/joined/', HubJoined.as_view(), name='hub-joined'),
        path('hubs/modding/', HubModerating.as_view(), name='hub-modding'),
        path('hubs/owned/', HubOwned.as_view(), name='hub-owned'),
        path('hubs/<int:id>/', HubByID.as_view(), name='hub-by-id'),
        path('hubs/create/', HubCreate.as_view(), name='hub-create'),
        path('hubs/<int:id>/delete/', HubDelete.as_view(), name='hub-delete'),
        path('hubs/<int:id>/update/', HubUpdate.as_view(), name='hub-update'),
        path('hubs/<int:id>/join/', HubAddMember.as_view(), name='hub-join'),
        path('hubs/<int:id>/request_join/', HubAddPendingMember.as_view(), name='hub-request-join'),
        path('hubs/<int:id>/cancel_request_join/', HubRemovePendingMember.as_view(), name='hub-cancel-request-join'),
        path('hubs/<int:id>/leave/', HubRemoveMember.as_view(), name='hub-leave'),
        path('hubs/<int:id>/kick/', HubKickMember.as_view(), name='hub-kick'),
        path('hubs/<int:id>/accept_join/', HubAddMemberFromPending.as_view(), name='hub-accept-join'),
        path('hubs/<int:id>/decline_join/', HubRemoveMemberFromPending.as_view(), name='hub-decline-join'),
        path('hubs/<int:id>/mods/add/', HubAddModerator.as_view(), name='hub-add-mod'),
        path('hubs/<int:id>/mods/remove/', HubRemoveModerator.as_view(), name='hub-remove-mod'),
        path('hubs/<int:id>/posts/', HubPosts.as_view(), name='hub-posts'),
        path('hubs/filter/', FilterHubs.as_view(), name='filter'),
]
