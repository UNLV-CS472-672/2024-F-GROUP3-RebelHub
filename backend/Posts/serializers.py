from rest_framework import serializers
from .models import Post
#To serialise the post which validates data from the frontend, and also send data to the front end  
class PostSerializer(serializers.ModelSerializer):
    #Create Serilized data based on the Post fields
    class Meta:
        model = Post
        # These fields will be serialized for the frontend validation
        fields = ['id', 'author', 'title', 'message', 'timestamp', 'hub', 'likePost', 'dislikePost'] 
        # Author will be read-only becaause it's set automatically
        read_only_fields = ['author']  
    
    def create(self, validated_data):
        # Automatically set the author to the currently authenticated user
        request = self.context.get('request', None)
        if request and hasattr(request, 'user'):
            validated_data['author'] = request.user
        return super().create(validated_data)
