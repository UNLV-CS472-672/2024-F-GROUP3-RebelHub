from django.db import models
from django.utils import timezone
from django.core.exceptions import ValidationError

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
    def clean(self):
        super().clean()
        if self.start_time and self.end_time and self.start_time >= self.end_time:
            raise ValidationError("End time must come after start time")
