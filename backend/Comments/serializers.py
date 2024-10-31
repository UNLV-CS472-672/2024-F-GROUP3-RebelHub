from rest_framework import serializers
from rest_framework.exceptions import PermissionDenied
from .models import Comment
from Posts.models import Post

# To serilize the comment        
class CommentSerializer(serializers.ModelSerializer):
    # Create Serilized data based on the Comment fields
    class Meta:
        model = Comment
        # comment_reply uses ForeignKey. So all the comment replies will have the same parent comment id. 
        # "replies" will list all replies associated with a specific comment.
        fields = ['id', 'post', 'author', 'message', 'timestamp', 'likes', 'dislikes', 'comment_reply', 'replies']
        read_only_fields = ['author', 'likes', 'dislikes']
        
        # Retrieves all replies from chosen comment
        def get_replies(self, instance):
            replies = instance.replies.all()
            return CommentSerializer(replies, many=True).data

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
        post_id = data.get('post_id')
        # Post associated with the given ID
        try:
            post = Post.objects.get(id=post_id)
        except Post.DoesNotExist:
            raise serializers.ValidationError("Post not found.") 
        
        # Associate the validated Post object with the comment data
        data['post'] = post
        return data

    # Create a new Comment instance using validated data
    def create(self, validated_data):
        request = self.context.get('request')
        user = request.user
        
        # Create and return the Comment instance
        new_comment = Comment.objects.create(author=user, **validated_data)
        return new_comment

# Serializer for liking a comment
class LikeCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = []  

    # Check user can like a comment and hasn't already liked it
    def validate(self, data):
        user = self.context.get('request').user
        
        # Flag tracks if like action can be performed or undone
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
        # Check dislike action can be done or undone
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