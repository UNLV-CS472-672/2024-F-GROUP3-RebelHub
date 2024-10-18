from django.db import models
from django.contrib.auth.models import User
# Note: The "user" is just a placeholder name as it hasn't been made yet. The foreign key will be changed based on the Hub api

# Create your models here.

# Class for creating post, includes author, title, message, and hub
class Post(models.Model):
    
    # Link a post to its author. Also allowing a post to be removed through deletion
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts') 
    title = models.CharField(max_length=300)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    hub = models.CharField(max_length=300)
    
    # The amount of upvotes(likes) and downvotes(dislikes)
    likePost = models.IntegerField(default=0)
    dislikePost = models.IntegerField(default=0)

    # Used for the string repersentation
    # This will make the post selectable from like a menu or dropdown list 
    def __str__(self):
        return self.title