from django.contrib import admin
from .models import Post
from Pictures.models import Picture

# Register your models here.


class PictureInline(admin.TabularInline):
    model = Picture
    extra = 1

class PostAdmin(admin.ModelAdmin):
    list_display = ['title', 'author', 'timestamp', 'hub']
    search_fields = ['title', 'author__username']
    list_filter = ['hub', 'timestamp'] 
    inlines = [PictureInline]

admin.site.register(Post, PostAdmin)