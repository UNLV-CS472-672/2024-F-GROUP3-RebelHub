from django.db import models

# Create your models here.
class Event(models.Model):
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    location = models.CharField(max_length=100, blank=True)
    start_time = models.TextField()
    end_time = models.TextField()
    def __str__(self):
        return self.name
