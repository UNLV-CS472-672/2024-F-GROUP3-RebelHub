from .models import Post
from django.dispatch import receiver
from django.db.models.signals import post_delete

@receiver(post_delete, sender=Post)
def delete_associated_image(sender, instance, **kwargs):
    """
    Delete the image from the media folder if the post was deleted.
    """
    if instance.image:
        instance.image.delete(save=False)
