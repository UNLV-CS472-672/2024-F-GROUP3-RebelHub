from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError
from hubs.models import Hub
from django.contrib.auth.models import User 

# Create your models here.
class Event(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    start_time = models.DateTimeField(default=timezone.now)
    end_time = models.DateTimeField(null=True, blank=True)
    color = models.CharField(max_length=20, blank=True, default="#eb4f34")
    hub = models.ForeignKey(Hub, on_delete=models.CASCADE, null=True, blank=True, related_name="events") 
    isPersonal = models.BooleanField(default=True)
    author = models.ForeignKey(User, on_delete=models.CASCADE, related_name="events") 
    
    def __str__(self):
        return self.title
    def clean(self):
        super().clean()
        if self.start_time and self.end_time and self.start_time >= self.end_time:
            raise ValidationError("End time must come after start time.")
        if not self.isPersonal and not self.hub:
            raise ValidationError("Events must be personal or linked to a hub.")
        if self.hub and self.isPersonal:
            raise ValidationError("Cannot have a hub for a personal event.")