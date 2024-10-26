from django.db import models
from django.contrib.auth.models import User
from Posts.models import Post  

# Create your models here.
class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    # Link to the post name and the comment made, also comment is able to be deleted
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    # The name of the author who made the comment
    message  = models.TextField()
    # The text message of the comment
    timestamp = models.DateTimeField(auto_now_add=True)
    # The time that the comment was set
    
    #The amount of upvotes or downvotes on the comment
    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)
    
    def __str__(self):
        return f'Comment by {self.author.username} on {self.post.title}'