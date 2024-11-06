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
        fields = ['id', 'title', 'description', 'location', 'start_time', 'end_time', 'color', 'hub', 'isPersonal', 'author']
        read_only_fields = ['id', 'author']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user

        # Function to test if string is valid hex color. This will act as a helper method
        if data.get('color').startswith('#'):
            if len(data.get('color')) == 7:
                for char in data.get('color')[1:]:
                    if char not in "0123456789abcdefABCDEF":
                        raise serializers.ValidationError("Invalid hex code. ")
            else: raise serializers.ValidationError("color must be 7 characters long including the #.")
        else: raise serializers.ValidationError("color must start with #.")
                        
        if data.get('start_time') and data.get('end_time'):
            if data['start_time'] >= data['end_time']:
                raise serializers.ValidationError("end_time must come after start_time")
            
        if not data.get('isPersonal'):
            if (data.get('hub') is None): 
                raise serializers.ValidationError("Non-personal events must have hubs.")
            if (data.get('hub').owner != user and user not in data.get('hub').mods.all()):
                raise serializers.ValidationError("You do not have permission to update this event.")
            
        if data.get('isPersonal') and not data.get('hub') is None:
            raise serializers.ValidationError("Personal events cannot have a hub.")    
        return data
        
    def create(self, validated_data):
        newly_created_event = Event.objects.create(**validated_data)
        newly_created_event.full_clean()
        newly_created_event.save()
        return newly_created_event

class EventUpdateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = ['id', 'title', 'description', 'location', 'start_time', 'end_time', 'color']
        read_only_fields = ['id']

    def validate(self, data):
        if data.get('color').startswith('#'):
            if len(data.get('color')) == 7:
                for char in data.get('color')[1:]:
                    if char not in "0123456789abcdefABCDEF":
                        raise serializers.ValidationError("Invalid hex code. ")
            else: raise serializers.ValidationError("color must be 7 characters long including the #.")
        else: raise serializers.ValidationError("color must start with #.")

        if data.get('start_time') and data.get('end_time'):
            if data['start_time'] >= data['end_time']:
                raise serializers.ValidationError("end_time must come after start_time")
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
    
