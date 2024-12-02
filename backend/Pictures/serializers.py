from django.shortcuts import get_object_or_404
from rest_framework import serializers

from  Posts.models import Post
from .models import Picture

class PictureSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Picture
        fields = ['id', 'image', 'timestamp', 'user', 'image_url']

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None

class CreatePostPictureSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Picture
        fields = ['id', 'image', 'image_url']
        read_only = ['id', 'image_url']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user

        post_id = self.context.get('post_id')
        post = Post.objects.get(pk=post_id)

        data['user'] = user
        data['post'] = post

        return data
    
    def create(self, validated_data):
        new_pic = Picture.objects.create(**validated_data)
        return new_pic

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None

class EditPostPictureSerializer(serializers.ModelSerializer):
    image = serializers.ImageField()
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Picture
        fields = ['image', 'image_url']
        read_only = ['image_url']
    
    def validate(self, data):
        pic_id = self.context.get('id')

        get_object_or_404(Picture, pk=pic_id)
        
        return data

    def update(self, instance, validated_data):
        instance.image = validated_data.get('image', instance.image)
        instance.save()
        
        return instance

    def get_image_url(self, obj):
        return obj.image.url if obj.image else None
