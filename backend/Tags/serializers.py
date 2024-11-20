from rest_framework import serializers
from .models import Tags
from hubs.models import Hub
from rest_framework.exceptions import PermissionDenied

class GlobalTagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = ['id', 'name', 'isGlobal']
        read_only_fields = ['id']

class HubTagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = ['id', 'name', 'hub', 'isGlobal']
        read_only_fields = ['id']

class HubTagCreateSerializer(serializers.ModelSerializer):
    hub_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Tags
        fields = ['id', 'title', 'hub_id', 'isGlobal']
        read_only_fields = ['id']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        hub_id = data.get('hub_id')

        try:
            hub = Hub.objects.get(id=hub_id)
        except Hub.DoesNotExist:
            raise serializers.ValidationError("Could Not Create Tag : Hub Not Found")

        if user != hub.owner or user not in hub.mods.all():
            raise PermissionDenied("Cound Not Create Tag : Not a hub owner/moderator")

        data['hub'] = hub
        return data

    def create(self, validated_data):
        new_tag = Tags.objects.create(**validated_data)
        return new_tag 
