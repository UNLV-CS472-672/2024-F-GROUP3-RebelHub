from django.urls import path
from .views import NewConversation, CreateMessage

urlpatterns = [
    path('private-messaging/new/', NewConversation.as_view(), name='private-messaging-new'),
    path('private-messaging/<int:conversation_id>/send/', CreateMessage.as_view(), name='private-messaging-send'),
]
