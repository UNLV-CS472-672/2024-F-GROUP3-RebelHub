from rest_framework import serializers
from django.contrib.auth.models import User


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model=User
        fields=["id", "email","username","password"]
        read_only_fields = ["id"]
        extra_kwargs= {"password": {"write_only": True}}

    def create(self, validated_data):
        user=User.objects.create_user(**validated_data)
        return user

    def update(self, instance, validated_data):
        # Update and return an existing User instance
        instance.username = validated_data.get('username', instance.username)
        instance.save()
        return instance


class UserPublicInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'joined_hubs']


class ResetPasswordSerializer(serializers.Serializer):
    email=serializers.EmailField()