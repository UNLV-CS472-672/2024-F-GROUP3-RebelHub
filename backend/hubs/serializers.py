from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Hub

class HubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = '__all__'

class HubCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub
        fields = ['name', 'description']

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        newly_created_hub = Hub.objects.create(owner=user, **validated_data)
        return newly_created_hub

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

