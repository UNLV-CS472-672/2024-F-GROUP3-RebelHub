from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .models import Conversation
from .serializers import ConversationSerializer
from django.contrib.auth.models import User
from .models import Message
from .serializers import MessageSerializer

class CreateConversation(APIView):
    def post(self, request):
        creator = request.user 
        recipient = request.data['recipient_id']
        other_participant = User.objects.get(username=recipient)  
        participants = User.objects.filter(id__in=[creator.id, other_participant.id])

        if participants.count() != 2:
            return Response("Need two valid participants.", status=status.HTTP_400_BAD_REQUEST)
        
        existing_conversation = Conversation.objects.filter(participants=creator).filter(participants=other_participant).first()
        if existing_conversation:
            serializer = ConversationSerializer(existing_conversation)
            return Response(serializer.data, status=status.HTTP_200_OK)

        conversation = Conversation.objects.create(creator_id=creator)
        conversation.participants.set([creator, other_participant])
        serializer = ConversationSerializer(conversation)
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class CreateMessage(APIView):
    
    def post(self, request, conversation_id):
        creator = request.user
        message_content = request.data.get("message_content")
        if not message_content:
            return Response("Enter a Message.", status=status.HTTP_400_BAD_REQUEST)
        try:
            conversation = Conversation.objects.get(conversation_id=conversation_id, participants=creator)
        except Conversation.DoesNotExist:
            return Response("Conversation not found.", status=status.HTTP_404_NOT_FOUND)

        conversation_message = conversation.add_message(user=creator, content=message_content)
        serializer = MessageSerializer(conversation_message)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

class ConversationList(APIView):
    def get(self, request):
        user = request.user
        # Conversation list based on what last conversation had
        conversations = Conversation.objects.filter(participants=user).order_by('-timestamp')
        serializer = ConversationSerializer(conversations, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    

class MessageList(APIView):
    def get(self, request, conversation_id):
        user = request.user
        try:
            conversation_messages = Conversation.objects.get(conversation_id=conversation_id, participants=user)
        except Conversation.DoesNotExist:
            return Response("Conversation not found", status=status.HTTP_404_NOT_FOUND)

        messages = conversation_messages.fetch_messages()
        return Response(messages, status=status.HTTP_200_OK)