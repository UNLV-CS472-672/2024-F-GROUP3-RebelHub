from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Hub
from Events.models import Event
from django.utils import timezone

#Serializer for a Hub model with all fields included.
#This serializer represents a hub
class HubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user = self.context.get('request').user
        representation['joined'] = user in instance.members.all()
        representation['pending'] = user in instance.pending_members.all()
        representation['modding'] = user in instance.mods.all()
        representation['owned'] = user == instance.owner
        return representation

#Serializer fo a hub model with only fields that would be needed for a TL view.
class HubTLSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = ['id', 'name', 'description', 'owner', 'members', 'created_at', 'private_hub']

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        member_count = len(representation.pop('members'))
        representation['members'] = member_count

        user = self.context.get('request').user
        representation['joined'] = user in instance.members.all()
        representation['pending'] = user in instance.pending_members.all()
        representation['modding'] = user in instance.mods.all()
        representation['owned'] = user == instance.owner
        if instance.private_hub:
            representation.pop('owner')
        return representation

#Serializer for a handling making a new hub.
# Hub = {"name": "MY NEW HUB", "description": "A Cool Hub"}
# Hub2 = {"name": "MY NEW HUB", "description": "A Cool Hub", "private_hub": true}
# name and description are REQUIRED
# private_hub defaults to false
class HubCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = ['id', 'name', 'description', 'private_hub']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        newly_created_hub = Hub.objects.create(owner=user, **validated_data)
        return newly_created_hub


#Serializer for updating a hub.
# Hub = {"name": "NEW NAME", "description": "NEW DESC"}
# we check the request to see if caller is owner or a moderator. 
class HubUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = ['name', 'description', 'private_hub'] 

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        hub = self.instance
        if not hub.private_hub:
            setting_private = data.get('private_hub')
            if setting_private and user != hub.owner:
                raise serializers.ValidationError("Cannot Update Hub : Private/Public Can Only Be Set By Owner")
            elif setting_private:
                data['setting_private'] = True
            else:
                data['setting_private'] = False
            data['setting_public'] = False
        elif hub.private_hub:
            setting_public = data.get('private_hub')
            setting_public = not setting_public
            if setting_public and user != hub.owner:
                raise serializers.ValidationError("Cannot Update Hub : Private/Public Can Only Be Set By Owner")
            elif setting_public:
                data['setting_public'] = True
            else:
                data['setting_public'] = False
            data['setting_private'] = False
        return data

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user
        set_public = validated_data.get('setting_public')
        set_private = validated_data.get('setting_private')
        if instance.owner == user or user in instance.mods.all():
            instance.name = validated_data.get('name', instance.name)
            instance.description = validated_data.get('description', instance.description)
            if set_public:
                for user in instance.pending_members.all():
                    instance.pending_members.remove(user)
                    instance.members.add(user)
                instance.private_hub = False
            elif set_private:
                instance.private_hub = True
            instance.save()
            return instance
        else:
            raise serializers.ValidationError("Cannot Update Hub : You Are Not Owner/Moderator Of Hub")


#Serializer for a user to join a hub.
# no fields needed in the request. the endpoint already has hubid.
class HubAddMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = []

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user
        if user in instance.members.all():
            raise serializers.ValidationError("Cannot Join Hub : You Are Already a Member")
        elif instance.private_hub:
            raise serializers.ValidationError("Cannot Join Hub : Hub Is Private")
        else:
            instance.members.add(user)
            instance.save()
            return instance


#Serializer for a user to leave a hub.
# no fields needed in request. the endpoint already has hubid.
# user leaving must be a hub member & cannot be the hub owner.
class HubRemoveMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = []

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user
        if user in instance.members.all() and user != instance.owner:
            instance.members.remove(user)
            if user in instance.mods.all():
                instance.mods.remove(user)
            instance.save()
            return instance
        elif user in instance.members.all() and user == instance.owner:
            raise serializers.ValidationError("Cannot Leave Hub : Hub Owners Must Delete Hub To Leave")
        else:
            raise serializers.ValidationError("Cannot Leave Hub : Not A Hub Member")

#Serializer for a user to request join a private hub.
# no fields needed in request. the endpoint already has hubid.
class HubAddPendingMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = []

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user
        if not instance.private_hub:
            raise serializers.ValidationError("Cannot Request a Join : Hub is Public")
        if user in instance.members.all():
            raise serializers.ValidationError("Cannot Request a Join : You Are Already a Member")
        if user in instance.pending_members.all():
            raise serializers.ValidationError("Cannot Request a Join : You Are Already a Pending Member")

        instance.pending_members.add(user)
        instance.save()
        return instance

#Serializer for a user to cancel their request to join a private hub.
# no fields needed in request. the endpoint already has hubid.
class HubRemovePendingMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = []

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user
        if user not in instance.pending_members.all():
            raise serializers.ValidationError("Cannot Cancel Request to Join : You Are Not a Pending Member")
        if not instance.private_hub:
            raise serializers.ValidationError("Cannot Cancel Request to Join : Hub is Public")

        instance.pending_members.remove(user)
        instance.save()
        return instance

#Serializer for a hub owner or hub moderator to accept a user into hub
# user_id of member to add needed in request. the endpoint already has hubid.
# user_id must be a user in the pending members table.
class HubAddMemberFromPendingSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Hub
        fields = ['user_id']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        hub = self.instance
        user_id = data.get('user_id')

        if not hub.private_hub:
            raise serializers.ValidationError("Cannot Add Member : Hub is public")

        try:
            user_to_add = User.objects.get(id=user_id)
        except User.DoesNotExits:
            raise serializers.ValidationError("Cannot Add Member : User Does Not Exist")

        if user != hub.owner and  user not in hub.mods.all():
            raise serializers.ValidationError("Cannot Add Member : You Don't Have Permission")

        if user_to_add in hub.members.all():
            raise serializers.ValidationError("Cannot Add Member : Member already in hub")

        if user_to_add not in hub.pending_members.all():
            raise serializers.ValidationError("Cannot Add Member : Member is not pending a join")

        data['new_member'] = user_to_add
        return data

    def update(self, instance, validated_data):
        new_member = validated_data.get('new_member')
        instance.pending_members.remove(new_member)
        instance.members.add(new_member)
        instance.save()
        return instance

#Serializer for a hub owner or hub mod to kick a pending member
class HubRemoveMemberFromPendingSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Hub
        fields = ['user_id']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        hub = self.instance
        user_id = data.get('user_id')

        try:
            user_to_kick = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("Cannot Deny Join Request : User does not exist")

        if user != hub.owner and user not in hub.mods.all():
            raise serializers.ValidationError("Cannot Deny Join Request : You don't have permissions")

        if user_to_kick not in hub.pending_members.all():
            raise serializers.ValidationError("Cannot Deny Join Request : User is not a pending member")

        data['bye_user'] = user_to_kick
        return data

    def update(self, instance, validated_data):
        bye_user = validated_data.get('bye_user')
        instance.pending_members.remove(bye_user)
        instance.save()
        return instance



#Serializer for a hub owner to kick any hub member
class HubKickMemberSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Hub
        fields = ['user_id']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        hub = self.instance
        user_id = data.get('user_id')

        try:
            user_to_kick = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("Cannot Kick User : User does not exist")

        if user != hub.owner:
            raise serializers.ValidationError("Cannot Kick User : You are not hub owner")

        if user_to_kick == hub.owner:
            raise serializers.ValidationError("Cannot Kick User : Owner cannot be kicked")

        if user_to_kick not in hub.members.all():
            raise serializers.ValidationError("Cannot Kick User : User is not a hub member")

        data['bye_user'] = user_to_kick
        return data

    def update(self, instance, validated_data):
        bye_user = validated_data.get('bye_user')
        if bye_user in instance.mods.all():
            instance.mods.remove(bye_user)
        instance.members.remove(bye_user)
        instance.save()
        return instance


#Serializer for a hub owner to add moderator
# there is a a user_id (id of user you want to make mod) specified in the request body. endpoint has hubid 
class HubAddModSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Hub
        fields = ['user_id']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        hub = self.instance
        user_id = data.get('user_id')

        try:
            user_to_add = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("Cannot Add Mod : User Does Not Exist")

        if user != hub.owner:
            raise serializers.ValidationError("Cannot Add Mod : You Are Not Hub Owner")

        if user_to_add in hub.mods.all():
            raise serializers.ValidationError("Cannot Add Mod : User Is Already A Moderator")

        if user_to_add not in hub.members.all():
            raise serializers.ValidationError("Cannot Add Mod : User Is Not A Hub Member")

        data['new_mod'] = user_to_add
        return data

    def update(self, instance, validated_data):
        new_mod = validated_data.get('new_mod')
        instance.mods.add(new_mod)
        instance.save()
        return instance


#Serializer for a hub owner to remove a moderator
# there is a user_id (id of user you want to kick) specified in the request. endpoint already has hubid
class HubRemoveModSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Hub
        fields = ['user_id']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        hub = self.instance
        user_id = data.get('user_id')

        try:
            user_to_kick = User.objects.get(id=user_id)
        except User.DoesNotExist:
            raise serializers.ValidationError("Cannot Kick Mod : User Doesn't Exist")


        if user != hub.owner and user != user_to_kick:
            raise serializers.ValidationError("Cannot Kick Mod : You Are Not Hub Owner")

        if user_to_kick not in hub.mods.all():
            raise serializers.ValidationError("Cannot Kick Mod : User Is Not A Hub Moderator")

        data['mod_to_kick'] = user_to_kick
        return data

    def update(self, instance, validated_data):
        mod_to_kick = validated_data.get('mod_to_kick')
        instance.mods.remove(mod_to_kick)
        instance.save()
        return instance
    
# Serializer for hubs with tags
class FilterHubsSerializer(serializers.ModelSerializer):
    hub_tag = serializers.StringRelatedField(many=True)
    hub_events = serializers.SerializerMethodField() # Used to return event objects
    class Meta:
        model = Hub
        fields = ['id', 'name', 'description', 'owner', 'mods', 'members', 'created_at', 'private_hub', 'hub_tag', 'hub_events']

    def get_hub_events(self, obj):
        from Events.serializers import EventSerializer  # Imported here in order to avoid circular import issues
        now = timezone.now()

        # Get only the next 3 upcoming events
        events = Event.objects.filter(hub=obj, start_time__gte=now).order_by('start_time')[:3]
        return EventSerializer(events, many=True, context=self.context).data
