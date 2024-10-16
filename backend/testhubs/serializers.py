from rest_framework import serializers
from .models import DummyHub
from .models import Comment
from .models import Post

class DummyHubSerializer(serializers.ModelSerializer):
    class Meta:
        model = DummyHub
        fields = '__all__'

#To serilize the comment        
class CommentSerializer(serializers.ModelSerializer):
    #Create Serilized data based on the Comment  fields
    class Meta:
        model = Comment
        fields = ['id', 'post', 'author', 'message ', 'timestamp', 'upvotes', 'downvotes']

#To serilize the post  
class PostSerializer(serializers.ModelSerializer):
    #Create Serilized data based on the Post fields
    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'message', 'timestamp', 'hub']  
