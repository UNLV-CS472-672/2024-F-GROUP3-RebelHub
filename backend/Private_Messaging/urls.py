from django.urls import path
from .views import CreateConversation, CreateMessage, ConversationList, MessageList

urlpatterns = [
    path('private-messaging/new/', CreateConversation.as_view(), name='private-messaging-new'),
    path('private-messaging/<int:conversation_id>/send/', CreateMessage.as_view(), name='private-messaging-send'),
    path('private-messaging/list/', ConversationList.as_view(), name='private-messaging-list'),
    path('private-messaging/<int:conversation_id>/messages/', MessageList.as_view(), name='private-messaging-messages'),

]
