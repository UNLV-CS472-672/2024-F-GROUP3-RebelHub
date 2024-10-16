from django.db import models
from django.contrib.auth.models import User
# Create your models here.


class DummyHub(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField()

    def __str__(self):
        return self.name

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
    
class Comment(models.Model):
    post = models.ForeignKey(Post, related_name='comments', on_delete=models.CASCADE)
    # Link to the post name and the comment made, also comment is able to be deleted
    author = models.ForeignKey(User, on_delete=models.CASCADE)
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