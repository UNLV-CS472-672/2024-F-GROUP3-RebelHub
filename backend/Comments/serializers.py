from rest_framework import serializers
from .models import Comment

#To serilize the comment        
class CommentSerializer(serializers.ModelSerializer):
    #Create Serilized data based on the Comment  fields
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'message ', 'timestamp', 'upvotes', 'downvotes']