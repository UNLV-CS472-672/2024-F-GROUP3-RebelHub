from rest_framework import serializers
from .models import Hub_Tag, Post_Tag
from hubs.models import Hub
from rest_framework.exceptions import PermissionDenied

class HubTagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub_Tag
        fields = ['id', 'name', 'tagged_hubs']
        read_only_fields = ['id']

class HubTagAssignSerializer(serializers.ModelSerializer):
    hub_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Hub_Tag
        fields = ['id', 'hub_id']
        read_only_fields = ['id']   

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        hub_id = data.get('hub_id')

        try:
            hub = Hub.objects.get(id=hub_id)
        except Hub.DoesNotExist:
            raise serializers.ValidationError("Could Not Assign Hub Tag : Hub Not Found.")

        if user != hub.owner or user not in hub.mods.all():
            raise PermissionDenied("Cound Not Assign Hub Tag : Not a hub owner/moderator.")

        data['hub_for_storing'] = hub

        hub_tags_count = Hub_Tag.objects.filter(tagged_hubs=hub).count()

        if hub_tags_count >= 3:
            raise serializers.ValidationError("Cannot exceed 3 hub tags for a hub.") 

        return data

    def create(self, validated_data):
        try:
            tag = Hub_Tag.objects.get(id=validated_data['id'])
        except Hub_Tag.DoesNotExist:
            raise serializers.ValidationError("Tag is not a hub or the tag cannot be found.")
        hub = validated_data['hub_for_storing'] 
        tag.tagged_hubs.add(hub) 

        return tag


class PostTagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post_Tag
        fields = ['id', 'name', 'hub']
        read_only_fields = ['id']

class PostTagCreateSerializer(serializers.ModelSerializer):
    hub_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Post_Tag
        fields = ['id', 'name', 'hub_id']
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
        new_tag = Post_Tag.objects.create(**validated_data)
        return new_tag 