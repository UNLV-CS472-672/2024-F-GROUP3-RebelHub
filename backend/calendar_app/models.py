from django.db import models
from django.utils import timezone

# Create your models here.
class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    color = models.CharField(max_length=20, blank=True, default="#eb4f34")
    def __str__(self):
        return self.title
