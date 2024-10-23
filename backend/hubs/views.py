from django.shortcuts import render
from rest_framework import generics
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.exceptions import PermissionDenied
from .models import Hub
from .serializers import HubSerializer, HubUpdateSerializer, HubCreateSerializer, HubAddMemberSerializer, HubRemoveMemberSerializer, HubAddModSerializer, HubRemoveModSerializer

# "api/hubs/"
# returns all the hubs that are public.
class HubList(generics.ListAPIView):
    queryset = Hub.objects.filter(private_hub=False)
    serializer_class = HubSerializer
    permission_classes = [AllowAny]

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
    queryset = Hub.objects.all()
    serializer_class = HubSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

# "api/hubs/create/"
# a hub name
# a hub description
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

# "api/hubs/<id>/mods/add"
class HubAddModerator(generics.UpdateAPIView):
    queryset = Hub.objects.all()
    serializer_class = HubAddModSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"

    def perform_update(self, serializer):
        serializer.save()

# "api/hubs/<id>/mods/remove"
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
