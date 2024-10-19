from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Hub

class HubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = '__all__'

class HubCreateSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True, required=True)

    class Meta:
        model = Hub
        fields = ['name', 'description', 'user_id']

    def create(self, validated_data):
        user_id = validated_data.pop('user_id')
        owner = User.objects.get(id=user_id)
        hub = Hub.objects.create(owner=owner, **validated_data)
        return hub

class HubUpdateSerializer(serializers.ModelSerializer):
    user_id = serializers.IntegerField(write_only=True, required=True)
    class Meta:
        model = Hub
        fields = ['name', 'description', 'user_id'] 

    def update(self, instance, validated_data):
        user_id = validated_data.pop('user_id')
        #if instance.owner.id != user_id: error
        instance.name = validated_data.get('name', instance.name)
        instance.description = validated_data.get('description', instance.description)
        instance.save()
        return instance 
