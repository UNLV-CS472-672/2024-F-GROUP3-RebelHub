# Generated by Django 4.2.12 on 2024-10-25 02:15

from django.conf import settings
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('hubs', '0002_hub_mods_hub_private_hub'),
    ]

    operations = [
        migrations.AddField(
            model_name='hub',
            name='pending_members',
            field=models.ManyToManyField(blank=True, related_name='requested_hubs', to=settings.AUTH_USER_MODEL),
        ),
    ]