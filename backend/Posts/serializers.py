from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from .models import Post
from hubs.models import Hub
from django.contrib.auth.models import User

# To serialise the post which validates data from the front end
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'message', 'timestamp', 'hub', 'likes', 'dislikes', 'last_edited'] 
        read_only_fields = ['author', 'likes', 'dislikes', 'last_edited']
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        user = self.context.get('request').user
        representation['is_author'] = user == instance.author
        representation['is_liked'] = user in instance.likes.all()
        representation['is_disliked'] = user in instance.dislikes.all()
        return representation
    """
    This method is used when a new Post object is being created. 
    When the API request comes in and makes the user the post author.
    So it's to make sure that the 'author' field is automatically set correct user. 
    """

class PostCreateSerializer(serializers.ModelSerializer):
    hub_id = serializers.IntegerField(write_only=True)
    class Meta:
        model = Post
        fields = ['id', 'title', 'message', 'hub_id']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        hub_id = data.get('hub_id')
        try:
            hub = Hub.objects.get(id=hub_id)
        except Hub.DoesNotExist:
            raise serializers.ValidationError("Could Not Create Post : Hub Not Found")

        if user not in hub.members.all():
            raise PermissionDenied("Cound Not Create Post : Not a hub member")

        data['hub'] = hub
        return data

    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        new_post = Post.objects.create(author=user, **validated_data)
        return new_post 

class LikePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = []

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        hub = self.instance.hub

        if user not in hub.members.all():
            raise PermissionDenied("Could Not Like Post : Not a hub member")

        data['making_like'] = True 
        if self.instance in user.liked_posts.all():
            data['making_like'] = False 

        return data

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user
        making_like = validated_data.get('making_like')
        if instance in user.disliked_posts.all():
            instance.dislikes.remove(user)
        if making_like:
            instance.likes.add(user)
        else:
            instance.likes.remove(user)
        instance.save()
        return instance

class DislikePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = []

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        hub = self.instance.hub

        if user not in hub.members.all():
            raise PermissionDenied("Could Not Dislike Post : Not a hub member")

        data['making_dislike'] = True 
        if self.instance in user.disliked_posts.all():
            data['making_dislike'] = False 

        return data

    def update(self, instance, validated_data):
        request = self.context.get('request')
        user = request.user
        making_dislike = validated_data.get('making_dislike')
        if instance in user.liked_posts.all():
            instance.likes.remove(user)
        if making_dislike:
            instance.dislikes.add(user)
        else:
            instance.dislikes.remove(user)
        instance.save()
        return instance

class PostEditSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'title', 'message', 'last_edited']
        read_only_fields = ['id']

    def validate(self, data):
        request = self.context.get('request')
        user = request.user
        post = self.instance

        if user != post.author:
            raise PermissionDenied("User does not have permission to update post")

        # Because of the constraints in the database, these are currently unnecessary
        if data.get('title') == "" or data.get('title') == None:
            raise serializers.ValidationError("Post needs to have a title")
        
        if data.get('message') == "" or data.get('message') == None:
            raise serializers.ValidationError("Post needs to have a message")
        
        if data.get('last_edited') == None:
            raise serializers.ValidationError("When editing a post, a last_edited field is required")

        return data
    
    def update(self, instance, validated_data):
        instance.title = validated_data.get('title', instance.title)
        instance.message = validated_data.get('message', instance.message)
        instance.last_edited = validated_data.get('last_edited', instance.last_edited)
        instance.save()

        return instance

class PostCountSerializer(serializers.ModelSerializer):
    post_count = serializers.SerializerMethodField()

    class Meta:
        model = User
        fields = ['id', 'username', 'post_count']

    def get_post_count(self, obj):
        return Post.objects.filter(author=obj).count()