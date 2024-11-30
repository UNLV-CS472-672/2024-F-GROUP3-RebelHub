from rest_framework import serializers
from .models import Conversation
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    UserName = serializers.CharField(source="userID.username", read_only=True)
    class Meta:
        model = Message
        fields = ["message_id", "user_id", "UserName", "message_content", "message_timestamp"]
        
class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    participants = serializers.StringRelatedField(many=True)
    class Meta:
        model = Conversation
        fields = ["conversation_id", "creator_id", "participants", "timestamp", "messages"]