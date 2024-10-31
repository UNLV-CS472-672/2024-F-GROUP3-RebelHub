# Generated by Django 5.1.2 on 2024-10-19 08:18

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Event',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=200)),
                ('description', models.TextField(blank=True)),
                ('location', models.CharField(blank=True, max_length=100)),
                ('start_time', models.CharField(max_length=50, blank=True)),
                ('end_time', models.CharField(max_length=50, blank=True)),
            ],
        ),
    ]