from rest_framework import serializers
from .models import Hub_Tag, Post_Tag
from hubs.models import Hub
from rest_framework.exceptions import PermissionDenied

class HubTagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hub_Tag
        fields = ['id', 'name', 'color']
        read_only_fields = ['id']


class PostTagsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post_Tag
        fields = ['id', 'name', 'hub', 'color']
        read_only_fields = ['id']

class PostTagCreateSerializer(serializers.ModelSerializer):
    hub_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Post_Tag
        fields = ['id', 'name', 'hub_id', 'color']
        read_only_fields = ['id']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        hub_id = data.get('hub_id')

        # Function to test if string is valid hex color. This will act as a helper method
        if data.get('color').startswith('#'):
            if len(data.get('color')) == 7:
                for char in data.get('color')[1:]:
                    if char not in "0123456789abcdefABCDEF":
                        raise serializers.ValidationError("Invalid hex code. ")
            else: raise serializers.ValidationError("color must be 7 characters long including the #.")
        else: raise serializers.ValidationError("color must start with #.")

        try:
            hub = Hub.objects.get(id=hub_id)
        except Hub.DoesNotExist:
            raise serializers.ValidationError("Could Not Create Tag : Hub Not Found")

        if user != hub.owner and user not in hub.mods.all():
            raise PermissionDenied("Cound Not Create Tag : Not a hub owner/moderator")

        data['hub'] = hub
        return data

    def create(self, validated_data):
        new_tag = Post_Tag.objects.create(**validated_data)
        return new_tag 