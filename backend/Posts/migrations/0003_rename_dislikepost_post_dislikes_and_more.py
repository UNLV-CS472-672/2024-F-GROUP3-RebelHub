# Generated by Django 4.2.12 on 2024-10-18 06:33

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('Posts', '0002_rename_downvotes_post_dislikepost_and_more'),
    ]

    operations = [
        migrations.RenameField(
            model_name='post',
            old_name='dislikePost',
            new_name='dislikes',
        ),
        migrations.RenameField(
            model_name='post',
            old_name='likePost',
            new_name='likes',
        ),
    ]
