from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation
from .serializers import ConversationSerializer
from django.contrib.auth.models import User

class NewConversation(APIView):
    def post(self, request):
        creator = request.user
        participants_ids = request.data.get('participants', [])
        participants = User.objects.filter(id__in=participants_ids)

        if not participants.exists():
            return Response({"error": "No valid participants found."}, status=status.HTTP_400_BAD_REQUEST)

        conversation = Conversation.objects.create(creatorID=creator)
        conversation.participants.set(participants)
        conversation.participants.add(creator)
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class SendMessage(APIView):
    def post(self, request, conversation_id):
        conversation = Conversation.objects.get(conversationID=conversation_id)
        user = request.user
        content = request.data.get('messageContent', '')

        if not content:
            return Response({"error": "Message content cannot be empty."}, status=status.HTTP_400_BAD_REQUEST)

        conversation.add_message(user, content)
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)
