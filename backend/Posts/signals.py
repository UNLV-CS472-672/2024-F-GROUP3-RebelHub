from .models import Post
from django.dispatch import receiver
from django.db.models.signals import post_delete, pre_save

@receiver(post_delete, sender=Post)
def delete_associated_image(sender, instance, **kwargs):
    """
    Delete the image from the media folder if the post was deleted.
    """
    if instance.image:
        instance.image.delete(save=False)

@receiver(pre_save, sender=Post)
def delete_previous_image(sender, instance, **kwargs):
    """
    Delete the image from the media folder if the post image was changed.
    """
    try:
        old_instance = sender.objects.get(pk=instance.id)

        if old_instance.image and old_instance.image != instance.image:
            old_instance.image.delete(save=False)
    except:
        return
