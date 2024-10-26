from rest_framework import serializers
from .models import Post

# To serialise the post which validates data from the front end
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ['id', 'author', 'title', 'message', 'timestamp', 'hub', 'likes', 'dislikes'] 
        read_only_fields = ['author', 'likes', 'dislikes']
    
    """
    This method is used when a new Post object is being created. 
    When the API request comes in and makes the user the post author.
    So it's to make sure that the 'author' field is automatically set correct user. 
    """
    def create(self, validated_data):
        request = self.context.get('request', None)
        if request and hasattr(request, 'user'):
            validated_data['author'] = request.user
        return super().create(validated_data)
