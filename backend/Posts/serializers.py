from rest_framework import serializers
from .models import Post
#To serilize the post  
class PostSerializer(serializers.ModelSerializer):
    #Create Serilized data based on the Post fields
    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'message', 'timestamp', 'hub']  
