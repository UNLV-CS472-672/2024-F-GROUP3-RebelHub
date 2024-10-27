from rest_framework import serializers
from .models import Comment

# To serilize the comment        
class CommentSerializer(serializers.ModelSerializer):
    # Create Serilized data based on the Comment fields
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'message ', 'timestamp', 'likes', 'dislikes']
        read_only_fields = ['author', 'post'] 
        

        # When given a validated data, update and return the existing Comment instance.  
        def update(self, instance, validated_data):
            # Update likes, dislikes and the message
            if 'likes' in validated_data:
                instance.likes = validated_data.get('likes', instance.likes)

            if 'dislikes' in validated_data:
                instance.dislikes = validated_data.get('dislikes', instance.dislikes)
    
            if 'message' in validated_data:
                instance.message = validated_data.get('message', instance.message)

            # Save updated comment
            instance.save()
            return instance
