from .models import Picture
from django.dispatch import receiver
from django.db.models.signals import post_delete, pre_save

@receiver(post_delete, sender=Picture)
def delete_associated_image(sender, instance, **kwargs):
    """
    Delete the image from the media folder if the picture object was deleted.
    """
    instance.image.delete(save=False)

@receiver(pre_save, sender=Picture)
def delete_previous_image(sender, instance, **kwargs):
    """
    Delete the image from the media folder if the picture object's image was changed.
    """
    try:
        old_instance = sender.objects.get(pk=instance.id)

        if old_instance.image and old_instance.image != instance.image:
            old_instance.image.delete(save=False)
    except:
        return
