from django.db import models
from django.contrib.auth.models import User
#Note: The "user" is just a placeholder name as it hasn't been made yet

# Create your models here.

# Class for creating post
class Post(models.Model):
    
     # Link a post to its author. Also allowing a post to be removed through deletion
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts')
    # The post title 
    title = models.CharField(max_length=300)
    # Text message under post
    message = models.TextField()
    # Allow to view when post has been made
    timestamp = models.DateTimeField(auto_now_add=True)
    
    # The name of the Hub the post belongs to
    hub = models.CharField(max_length=300)
    
    # The amount of upvotes(likes) and downvotes(dislikes)
    upvotes = models.IntegerField(default=0)
    downvotes = models.IntegerField(default=0)

    # Used for the string repersentation
    # This will make the post selectable from a menu list 
    def __str__(self):
        return self.title