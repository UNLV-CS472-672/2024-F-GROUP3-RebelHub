# Generated by Django 4.2.12 on 2024-10-28 00:29

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
        ('hubs', '0003_hub_pending_members'),
        ('Posts', '0003_rename_dislikepost_post_dislikes_and_more'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='dislikes',
        ),
        migrations.AlterField(
            model_name='post',
            name='hub',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='posts', to='hubs.hub'),
        ),
        migrations.RemoveField(
            model_name='post',
            name='likes',
        ),
        migrations.AddField(
            model_name='post',
            name='dislikes',
            field=models.ManyToManyField(blank=True, related_name='disliked_posts', to=settings.AUTH_USER_MODEL),
        ),
        migrations.AddField(
            model_name='post',
            name='likes',
            field=models.ManyToManyField(blank=True, related_name='liked_posts', to=settings.AUTH_USER_MODEL),
        ),
    ]
