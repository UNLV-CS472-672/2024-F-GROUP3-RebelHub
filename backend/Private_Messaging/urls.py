from django.urls import path
from . import views

urlpatterns = [
    path('create/', views.createConversation, name='create-conversation'),
]