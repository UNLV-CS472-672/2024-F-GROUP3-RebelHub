from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from .models import Hub
from .serializers import *
from Posts.models import Post
from Posts.serializers import PostSerializer

# "api/hubs/"
# returns all the hubs with limited fields.
class HubList(generics.ListAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubTLSerializer
    permission_classes = [AllowAny]

# "api/hubs/<id>/posts"
# returns all the posts in a hub.
class HubPosts(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"
    def get_queryset(self):
        hub_id = self.kwargs['id']
        try:
            this_hub = Hub.objects.get(id=hub_id)
        except Hub.DoesNotExist:
            raise NotFound("Cannot List Posts : Hub not found")
        user = self.request.user
        if this_hub.private_hub and user not in this_hub.members.all():
            raise PermissionDenied("Cannot List Posts : Hub is private")
        return Post.objects.filter(hub=this_hub)

# "api/hubs/joined/"
# returns all the hubs that a user has joined.
class HubJoined(generics.ListAPIView):
    serializer_class = HubSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Hub.objects.filter(members=user)


# "api/hubs/modding/"
# returns all the hubs that a user is moderating
class HubModerating(generics.ListAPIView):
    serializer_class = HubSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Hub.objects.filter(mods=user)

# "api/hubs/owned/"
# returns all the hubs that a user owns.
class HubOwned(generics.ListAPIView):
    serializer_class = HubSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Hub.objects.filter(owner=user)

# "api/hubs/<id>/"
# returns one hub corresponding to ID in request.
class HubByID(generics.RetrieveAPIView):
    serializer_class = HubSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"
    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            qs = Hub.objects.all()
        else:
            qs = Hub.objects.filter(private_hub=False)
        if qs is None:
            raise NotFound("No Hub With This ID Was Found")
        else:
            return qs
    


# "api/hubs/create/"
# a hub name
# a hub description
# private_hub (default to False)
# user has to be authenticated with token in header.
class HubCreate(generics.CreateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubCreateSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save()

# "api/hubs/<id>/update/"
# hub name and hub description can be updated.
# user has to be authenticated with token in header.
class HubUpdate(generics.UpdateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubUpdateSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def perform_update(self, serializer):
        serializer.save()

# "api/hubs/<id>/mods/add/"
# user_id of user to make moderator needed in request body
# user making request must be hub owner
class HubAddModerator(generics.UpdateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubAddModSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def perform_update(self, serializer):
        serializer.save()

# "api/hubs/<id>/mods/remove/"
# user_id of user to remove as moderator needed in request body
# user making request must be hub owner
class HubRemoveModerator(generics.UpdateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubRemoveModSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def perform_update(self, serializer):
        serializer.save()

# "api/hubs/<id>/delete/"
# user making request must be owner of hub.
class HubDelete(generics.DestroyAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def perform_destroy(self, instance):
        if instance.owner != self.request.user:
            raise PermissionDenied("Cannot Delete Hub : No Permissons To Delete This Hub")
        else:
            instance.delete()


# "api/hubs/<id>/join/"
# user making request wants to join hub <id>
# user must be authenticated and not already a member
class HubAddMember(generics.UpdateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubAddMemberSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

# "api/hubs/<id>/leave/"
# user making request want to leave hub <id>
# user must be authenticated and a hub member <NOT OWNER>
class HubRemoveMember(generics.UpdateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubRemoveMemberSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

# "api/hubs/<id>/request_join/"
# user making request wants to request to join hub <id>
# user must be authenticated, not already a member, and hub must be PRIVATE
class HubAddPendingMember(generics.UpdateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubAddPendingMemberSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

# "api/hubs/<id>/cancel_request_join/"
# user making request want to cancel their request to join hub <id>
# user must be authenticated, and a current pending member of hub
class HubRemovePendingMember(generics.UpdateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubRemovePendingMemberSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

# "api/hubs/<id>/accept_join/"
# user_id of user to accept needed in request body
# user making request must be owner or moderator
class HubAddMemberFromPending(generics.UpdateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubAddMemberFromPendingSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

# "api/hubs/<id>/decline_join/"
# user_id of user to decline needed in request body
# user making request must be owner or moderator
class HubRemoveMemberFromPending(generics.UpdateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubRemoveMemberFromPendingSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

# "api/hubs/<id>/kick/"
# user_id of user to kick needed in request body
# user making request must be owner
class HubKickMember(generics.UpdateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubKickMemberSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"
