from django.db import models
from django.contrib.auth.models import User
from Posts.models import Post
from django.utils.timezone import now

def user_diretory_path(instance,filename):
    return f'users/{instance.user.id}/{now().strftime("%Y/%m/%d")}/{filename}'

class Picture(models.Model):
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='pictures')
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='pictures')
    image = models.ImageField(upload_to=user_diretory_path)
    time_created = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'Picture by {self.user.username}'