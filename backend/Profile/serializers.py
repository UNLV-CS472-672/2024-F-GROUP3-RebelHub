from rest_framework import serializers
from .models import Profile

class ProfileSerializer(serializers.ModelSerializer):
    # hubs_count = serializers.ReadOnlyField(source='hubs_count')  

    class Meta:
        model = Profile
        fields = ['user', 'bio', 'created_at', 'pfp', 'name', 'hubs_count']
        read_only_fields = ['created_at', 'user', 'hubs_count']

    def update(self, instance, validated_data):
        instance.name = validated_data.get('name', instance.name)
        instance.bio = validated_data.get('bio', instance.bio)
        instance.pfp = validated_data.get('pfp', instance.pfp)
        instance.save()
        return instance
    