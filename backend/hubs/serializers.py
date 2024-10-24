from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Hub

#Serializer for a Hub model with all fields included.
#This serializer represents a hub
class HubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = '__all__'

#Serializer for a handling making a new hub.
# Hub = {"name": "MY NEW HUB", "description": "A Cool Hub"}
class HubCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = ['name', 'description']

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
        fields = ['name', 'description'] 

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user
        if instance.owner == user or user in instance.mods.all():
            instance.name = validated_data.get('name', instance.name)
            instance.description = validated_data.get('description', instance.description)
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
        if user not in instance.members.all():
            instance.members.add(user)
            instance.save()
            return instance
        else:
            raise serializers.ValidationError("Cannot Join Hub : You Are Already a Member")


#Serializer for a user to leave a hub.
# no fields needed in request. the endpoint already has hubid.
class HubRemoveMemberSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = []

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user
        if user in instance.members.all() and user != instance.owner:
            instance.members.remove(user)
            instance.save()
            return instance
        elif user in instance.members.all() and user == instance.owner:
            raise serializers.ValidationError("Cannot Leave Hub : Hub Owners Must Delete Hub To Leave")
        else:
            raise serializers.ValidationError("Cannot Leave Hub : Not A Hub Member")



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


        if user != hub.owner:
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


