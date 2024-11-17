from rest_framework import serializers
from .models import Conversation

class ConversationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Conversation
        fields = [
            'conversationID', 'creatorID', 'participants','timestamp', 'messageID', 'userID', 'messageContent', 'messageTimestamp'
        ]
