from rest_framework import serializers
from .models import Conversation
from .models import Message


class MessageSerializer(serializers.ModelSerializer):
    UserName = serializers.CharField(source="userID.username", read_only=True)
    class Meta:
        model = Message
        fields = ["messageID","userID", "UserName", "messageContent","messageTimestamp",]
        
class ConversationSerializer(serializers.ModelSerializer):
    messages = MessageSerializer(many=True, read_only=True)
    participants = serializers.StringRelatedField(many=True)
    class Meta:
        model = Conversation
        fields = ["conversationID","creatorID", "participants","timestamp","messages",]