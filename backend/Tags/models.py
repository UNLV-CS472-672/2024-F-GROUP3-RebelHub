from django.db import models
from hubs.models import Hub
from django.core.exceptions import ValidationError

# Create your models here.
class Hub_Tag(models.Model):
    name = models.CharField(max_length=16, unique=True)
    tagged_hubs = models.ManyToManyField(Hub, related_name='hub_tag', blank=True) 
    
    def __str__(self):
        return self.name

class Post_Tag(models.Model):
    name = models.CharField(max_length=16)
    hub = models.ForeignKey(Hub, on_delete=models.SET_NULL, related_name='post_tag', blank=True, null=True)

    def __str__(self):
        return self.name
    def clean(self):
        super().clean()
        # Check if a tag with the same name exists in the same hub
        if Post_Tag.objects.filter(name=self.name, hub=self.hub).exclude(id=self.id).exists():
            raise ValidationError(f"A tag with the name '{self.name}' already exists in this hub.")