from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from .models import Comment
from rest_framework.exceptions import ValidationError
from Posts.models import Post

# To serilize the comment        
class CommentSerializer(serializers.ModelSerializer):
    replies = serializers.SerializerMethodField(read_only=True)

    # Create Serilized data based on the Comment fields
    class Meta:
        model = Comment
        # comment_reply uses ForeignKey. So all the comment replies will have the same parent comment id. 
        # "replies" will list all replies associated with a specific comment.
        fields = ['id', 'author', 'post', 'content', 'timestamp', 'likes', 'dislikes', 'replies', 'comment_reply']
        read_only_fields = ['author', 'likes', 'dislikes']
        
        # Retrieves all replies from chosen comment
        def get_replies(self, obj):
            if obj.comment_reply is None:  
                serializer = self.__class__(obj.replies.all(), many=True)
                serializer.bind('', self)
                return serializer.data
            return None

        # When given a validated data, update and return the existing Comment instance.  
        def to_representation(self, instance):
            representation = super().to_representation(instance)
            user = self.context.get('request').user
            representation['is_author'] = user == instance.author
            
            # Check if user has already liked or disliked the comment
            representation['is_liked'] = user in instance.likes.all()
            representation['is_disliked'] = user in instance.dislikes.all()
            return representation
    
 # Serializer for creating any new comments
class CommentCreateSerializer(serializers.ModelSerializer):
    post_id = serializers.IntegerField(write_only=True) 
    class Meta:
        model = Comment
        fields = ['message', 'post_id'] 
 
    # Validates the post and user permissions to for comment creation
    def validate(self, data):
        post = data.get('post')
        comment_reply = data.get('comment_reply')

        # Post associated with the given ID
        if comment_reply and comment_reply.post != post:
            raise ValidationError("Reply must be linked to a comment under the same post.")
        return data

    # Create a new Comment instance using validated data
    def create(self, validated_data):
        user = self.context.get('request').user
        return Comment.objects.create(author=user, **validated_data)

# Serializer for liking a comment
class LikeCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = []  

    # Check user can like a comment and hasn't already liked it
    def validate(self, data):
        user = self.context.get('request').user
        if self.instance.comment_reply is not None:
            raise ValidationError("You can't like a reply.")
        
        data['making_like'] = True
        if self.instance in user.liked_comments.all():
            data['making_like'] = False
        return data
    
     # Update the comment status 
    def update(self, instance, validated_data):
        user = self.context.get('request').user
        making_like = validated_data.get('making_like')
        
        # If users disliked, but now switches to liking a comment
        if instance in user.disliked_comments.all():
            instance.dislikes.remove(user)
        if making_like:
            instance.likes.add(user)
        else:
            instance.likes.remove(user)
        instance.save()
        return instance
    
# Used to handle disliking a comment
class DislikeCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = [] 

    # Check user can dislike a comment and hasn't already disliked
    def validate(self, data):
        user = self.context.get('request').user
        if self.instance.comment_reply is not None:
            raise ValidationError("You cannot dislike a reply.")
        
        data['making_dislike'] = True
        if self.instance in user.disliked_comments.all():
            data['making_dislike'] = False
        return data

    # Update comment's dislike
    def update(self, instance, validated_data):
        user = self.context.get('request').user
        making_dislike = validated_data.get('making_dislike')
        
        # Remove like if user liked comment, but now is going to dislike
        if instance in user.liked_comments.all():
            instance.likes.remove(user)
        if making_dislike:
            instance.dislikes.add(user)
        else:
            instance.dislikes.remove(user)
        instance.save()
        return instance