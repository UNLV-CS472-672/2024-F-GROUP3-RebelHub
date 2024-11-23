from django.db import models
from django.contrib.auth.models import User

class Conversation(models.Model):
    
    # This is the only auto-generated field
    conversationID = models.AutoField(primary_key=True)  
    creatorID = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_conversations')
    participants = models.ManyToManyField(User, related_name='conversations')
    timestamp = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return str(self.conversationID)
    
    def add_message(self, user, content):
        message = Message.objects.create(conversationID=self,userID=user,messageContent=content)
        return message
        
    # Viewing all messages in conversation   
    def fetch_messages(self):
        messages = Message.objects.filter(conversationID=self).order_by('messageTimestamp')
        return [{ "Message ID": message.messageID, "user ID": message.userID.id, "User Name": message.userID.username, 
                 "Message Content": message.messageContent,"Message Timestamp": message.messageTimestamp,}
            for message in messages
        ]

    def add_participants(self, *users):
        if self.participants.count() + len(users) > 2:
            raise ValueError("No more than two participants is allowed.")
        self.participants.add(*users)

class Message(models.Model):
    # Unique ID for each message
    messageID = models.AutoField(primary_key=True)
    conversationID = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
    userID = models.ForeignKey(User, on_delete=models.CASCADE, related_name='message_user')
    messageContent = models.TextField()
    messageTimestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.messageID)