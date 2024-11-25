from django.db import models
from django.contrib.auth.models import User
from hubs.models import Hub
from Tags.models import Post_Tag
# Note: The "user" is just a placeholder name as it hasn't been made yet. The foreign key will be changed based on the Hub api

# Create your models here.

# Class for creating post, includes author, title, message, and hub
class Post(models.Model):
    
    # Link a post to its author. Also allowing a post to be removed through deletion
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name='posts') 
    title = models.CharField(max_length=300)
    message = models.TextField()
    timestamp = models.DateTimeField(auto_now_add=True)
    hub = models.ForeignKey(Hub, on_delete=models.CASCADE, related_name='posts')
    
    # The amount of upvotes(likes) and downvotes(dislikes)
    likes = models.ManyToManyField(User, related_name='liked_posts', blank=True)
    dislikes = models.ManyToManyField(User, related_name='disliked_posts', blank=True)

    # Used for hot sorting
    hot_score = models.FloatField(default=0)
    # Stores the date of when the post was last edited
    last_edited = models.DateTimeField(blank=True, null=True)

    # Used for viewing posts based on tags
    tag = models.ForeignKey(Post_Tag, related_name='tagged_post', on_delete=models.SET_NULL, null=True, blank=True)

    # Used for the string repersentation and will make the post selectable from like a menu or dropdown list 
    def __str__(self):
        return self.title
