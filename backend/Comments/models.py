from django.db import models
from django.contrib.auth.models import User
from Comments.models import Post 

# Create your models here.

# Class for creating comments underpost. Includes which post, author, their message, and time posted
class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='comments')
    message  = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # The amount of upvotes(likes) and downvotes(dislikes)on the comment
    likes = models.IntegerField(default=0)
    dislikes = models.IntegerField(default=0)
    
    # Shows which user commented on which post
    def __str__(self):
        return f'Comment from: {self.author.username} and on {self.post.title}'
    
    # Used for the default ordering of the comments, based on amount of likes
    class Meta:
        ordering = ['-likes']
        
        