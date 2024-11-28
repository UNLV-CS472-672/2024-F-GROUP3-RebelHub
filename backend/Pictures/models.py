from django.db import models
from django.contrib.auth.models import User
from Posts.models import Post
from django.utils.timezone import now

def user_directory_path(instance,filename):
    return f'users/{instance.user.id}/pictures/{filename}'

class Picture(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='picture')
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='picture')
    image = models.ImageField(upload_to=user_directory_path, null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Picture for {self.post.title if self.post else 'No Post'}"