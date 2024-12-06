from django.contrib import admin
from .models import Comment
# Register your models here.

class CommentAdmin(admin.ModelAdmin):
    list_display = ['author', 'post', 'comment_reply']
    search_fields = ['author', 'post']
    list_filter = ['post__id']

admin.site.register(Comment, CommentAdmin)
