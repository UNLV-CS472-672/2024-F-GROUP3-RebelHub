from rest_framework import serializers
from .models import Post, Picture

class PictureSerializer(serializers.ModelSerializer):
    class Meta:
        model = Picture
        fields = ['id', 'image', 'timestamp']
