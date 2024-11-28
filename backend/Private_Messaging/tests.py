from django.test import TestCase
from django.contrib.auth.models import User
from Private_Messaging.models import Conversation, Message

class ConversationModelTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="test_user_1", password="password")
        self.user2 = User.objects.create_user(username="test_user_2", password="password")
        self.conversation = Conversation.objects.create(creator_id=self.user1)
        self.conversation.participants.add(self.user1, self.user2)

    def test_add_message_with_invalid_user(self):
        with self.assertRaises(ValueError):
            self.conversation.add_message(user=None, content="Chat Failed")
            
    def test_add_message(self):
        message = self.conversation.add_message(user=self.user1, content="Hey it's me, wanna chat?")
        self.assertEqual(message.message_content, "Hey it's me, wanna chat?")
        self.assertEqual(message.user_id, self.user1)
