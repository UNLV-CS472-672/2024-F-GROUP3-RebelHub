from django.db import models
from django.contrib.auth.models import User  
from django.core.files.storage import default_storage
import os

# Create your models here.
def user_directory_path(instance, filename):
    return f'users/{instance.user.id}/profile/{filename}'

def get_default_username():
    return User.objects.first().username if User.objects.exists() else 'no_username'

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    bio = models.TextField(blank=True, null=True, max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
    pfp = models.ImageField(upload_to=user_directory_path, default='defaultpfp.png')
    name = models.CharField(max_length=50, default=get_default_username)

    def __str__(self):
        return f"{self.user.username}'s Profile"
    
    @property
    def hubs_count(self):
        return (
            self.user.joined_hubs.count() + self.user.moderating_hubs.count() + self.user.owned_hubs.count() 
        )

    def save(self, *args, **kwargs):
        if self.pk:
            old_pfp = Profile.objects.get(pk=self.pk).pfp

            if old_pfp and old_pfp != self.pfp:
                if os.path.isfile(old_pfp.path):
                    os.remove(old_pfp.path)

        super(Profile,self).save(*args, **kwargs)