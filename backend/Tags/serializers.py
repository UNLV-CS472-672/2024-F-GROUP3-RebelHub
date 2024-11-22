from rest_framework import serializers
from .models import Tags
from hubs.models import Hub
from rest_framework.exceptions import PermissionDenied

class GlobalTagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = ['id', 'name', 'tagged_hubs', 'isGlobal']
        read_only_fields = ['id', 'isGlobal']

class GlobalTagAssignSerializer(serializers.ModelSerialier):
    hub_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = Tags
        fields = ['id', 'hub_id', 'isGlobal']
        read_only_fields = ['id', 'isGlobal']   

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        hub_id = data.get('hub_id')

        try:
            hub = Hub.objects.get(id=hub_id)
        except Hub.DoesNotExist:
            raise serializers.ValidationError("Could Not Assign Global Tag : Hub Not Found")

        if user != hub.owner or user not in hub.mods.all():
            raise PermissionDenied("Cound Not Assign Global Tag : Not a hub owner/moderator")

        data['hub'] = hub

        global_tags_count = Tags.objects.filter(tagged_hubs=hub, isGlobal=True).count()

        if global_tags_count >= 3:
            raise serializers.ValidationError("This hub already has 3 global tags. No more tags can be added.") 

        return data

     def create(self, validated_data):
        tag = Tags.objects.get(id=validated_data['id'], isGlobal=True)
        hub = validated_data['hub'] 
        tag.tagged_hubs.add(hub) 

        return tag


class HubTagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Tags
        fields = ['id', 'name', 'hub', 'isGlobal']
        read_only_fields = ['id', 'isGlobal']

class HubTagCreateSerializer(serializers.ModelSerializer):
    hub_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Tags
        fields = ['id', 'name', 'hub_id', 'isGlobal']
        read_only_fields = ['id', 'isGlobal']

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
