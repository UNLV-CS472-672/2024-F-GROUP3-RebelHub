from django.db import models
from django.contrib.auth.models import User

class Conversation(models.Model):
    conversationID = models.AutoField(primary_key=True)  # This is the only auto-generated field
    creatorID = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_conversations')
    participants = models.ManyToManyField(User, related_name='conversations')
    timestamp = models.DateTimeField(auto_now_add=True)

    # Message-related fields (without auto-generated ID)
    userID = models.ForeignKey(User, on_delete=models.CASCADE, related_name='message_user')
    messageContent = models.TextField()
    messageTimestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Conversation {self.conversationID}"

    def add_message(self, user, content):
        self.userID = user
        self.messageContent = content
        self.messageTimestamp = models.DateTimeField(auto_now=True)
        self.save()
