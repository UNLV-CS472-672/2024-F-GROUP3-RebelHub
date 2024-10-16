from django.db import models
from django.contrib.auth.models import User


# Create your models here.
#Class for creating post
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    # Link a post to its author. Also allowing a post to be removed through deletion
    title = models.CharField(max_length=300)
    # The post title 
    message = models.TextField()
    # Text message under post
    timestamp = models.DateTimeField(auto_now_add=True)
    # Allow to view when post has been made
    hub = models.CharField(max_length=300)
    # The name of the Hub or Subhub the post belongs to
    upvotes = models.IntegerField(default=0)
    # The amount of upvotes(likes)
    downvotes = models.IntegerField(default=0)
    # The amount of downvotes(dislikes)