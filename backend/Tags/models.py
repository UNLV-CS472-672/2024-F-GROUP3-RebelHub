from django.db import models
from hubs.models import Hub
from django.core.exceptions import ValidationError

# Create your models here.
class Tags(models.Model):
    name = models.CharField(max_length=16)
    tagged_hubs = models.ManyToManyField(Hub, related_name='tag', blank=True)
    isGlobal = models.BooleanField(default=True)
    hub = models.ForeignKey(Hub, related_name='tag', blank=True)
    
    def __str__(self):
        return self.name
    def clean(self):
        super().clean()
        if not self.isGlobal and not self.hub:
            raise ValidationError("Tags must be global or linked to a hub.")
        if self.hub and self.isGlobal:
            raise ValidationError("Cannot be both a hub tag and a global tag.")