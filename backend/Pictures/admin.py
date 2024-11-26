from django.contrib import admin
from .models import Picture

# Register your models here.
class PictureAdmin(admin.ModelAdmin):
    list_display = ['post', 'image', 'timestamp']  # Display relevant fields
    search_fields = ['post__title', 'post__author__username']  # Enable search by post title and author
    list_filter = ['timestamp']  # Filter by creation date


admin.site.register(Picture, PictureAdmin)
