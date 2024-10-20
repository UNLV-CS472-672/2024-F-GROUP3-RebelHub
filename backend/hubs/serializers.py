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
# we check the request to see if caller is owner. 
class HubUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = ['name', 'description'] 

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user
        if instance.owner == user:
            instance.name = validated_data.get('name', instance.name)
            instance.description = validated_data.get('description', instance.description)
            instance.save()
            return instance
        else:
            raise serializers.ValidationError("Cannot Update Hub : You Are Not Owner Of Hub")


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
