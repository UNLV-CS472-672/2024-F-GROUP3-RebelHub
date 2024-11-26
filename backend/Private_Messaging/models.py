from django.db import models
from django.contrib.auth.models import User

class Conversation(models.Model):
       
    # This is the only auto-generated field
    conversation_id = models.AutoField(primary_key=True)  
    creator_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='created_conversations')
    participants = models.ManyToManyField(User, related_name='conversations')
    timestamp = models.DateTimeField(auto_now_add=True)


    def __str__(self):
        return str(self.conversation_id)
        
    def add_message(self, user, content):
        message = Message.objects.create(conversation_id=self,user_id=user,message_content=content)
        return message
            
    # Viewing all messages in conversation   
    def fetch_messages(self):
        messages = Message.objects.filter(conversation_id=self).order_by('message_timestamp')
        return [{ "Message ID": message.message_id, "user ID": message.user_id.id, "User Name": message.user_id.username, 
                    "Message Content": message.message_content,"Message Timestamp": message.message_timestamp,}
                for message in messages
            ]

    def add_participants(self, *users):
        if self.participants.count() + len(users) > 2:
            raise ValueError("No more than two participants is allowed.")
        self.participants.add(*users)

class Message(models.Model):
        # Unique ID for each message
        message_id = models.AutoField(primary_key=True)
        conversation_id = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
        user_id = models.ForeignKey(User, on_delete=models.CASCADE, related_name='message_user')
        message_content = models.TextField()
        message_timestamp = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return str(self.message_id)