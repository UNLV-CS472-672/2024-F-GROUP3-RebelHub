from rest_framework import serializers
from .models import Picture

class PictureSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Picture
        fields = ['id', 'image', 'timestamp', 'user', 'image_url']

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None