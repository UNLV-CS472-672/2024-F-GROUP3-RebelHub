from django.db import models
from hubs.models import Hub

# Create your models here.
class Tags(models.Model):
    name = models.CharField(max_length=50)
    hub = models.ManyToManyField(Hub, related_name='tag', blank=True)
    isGlobal = models.BooleanField(default=True)
    
    def __str__(self):
        return self.name