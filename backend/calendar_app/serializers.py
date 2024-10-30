from rest_framework import serializers
from .models import Event
from hubs.serializers import HubSerializer

class EventSerializer(serializers.ModelSerializer):
    hub = HubSerializer(required=False) # Used to get details for hub (name, description, etc...) instead of just hub id
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'location', 'start_time', 'end_time', 'color', 'hub', 'isPersonal', 'author']
        read_only_fields = ['id']

class EventCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'location', 'start_time', 'end_time', 'color', 'hub', 'isPersonal']
        read_only_fields = ['id']

    def create(self, validated_data):
        newly_created_event = Event.objects.create(**validated_data)
        newly_created_event.full_clean()
        newly_created_event.save()
        return newly_created_event

class EventUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['title', 'description', 'location', 'start_time', 'end_time', 'color']
        read_only_fields = ['id']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        event = self.instance
        if data.get('start_time') and data.get('end_time'):
            if data['start_time'] >= data['end_time']:
                raise serializers.ValidationError("end_time must come after start_time")
        if (event.isPersonal and event.author != user) or (not event.isPersonal and (event.hub.owner != user and user not in event.hub.mods.all())):
            raise serializers.ValidationError("You do not have permission to update this event.")
        return data

    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.description = validated_data.get('description', instance.description)
        instance.location = validated_data.get('location', instance.location)
        instance.start_time = validated_data.get('start_time', instance.start_time)
        instance.end_time = validated_data.get('end_time', instance.end_time)
        instance.color = validated_data.get('color', instance.color)
        instance.save()
        return instance
    