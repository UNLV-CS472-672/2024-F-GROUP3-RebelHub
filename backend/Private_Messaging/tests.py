from django.test import TestCase
from django.contrib.auth.models import User
from Private_Messaging.models import Conversation, Message

class ConversationModelTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="test_user_1", password="password")
        self.user2 = User.objects.create_user(username="test_user_2", password="password")
        self.user3 = User.objects.create_user(username="test_user_3", password="password")

        self.conversation = Conversation.objects.create(creator_id=self.user1)
        self.conversation.participants.add(self.user1, self.user2)

        # Tests for add_message method (line 14)
    def test_add_message_with_no_user(self):
        with self.assertRaises(ValueError):
            self.conversation.add_message(user=None, content="Chat Failed")
            
    def test_add_message_with_no_other_user(self):
        with self.assertRaises(ValueError):
            self.conversation.add_message(user=None, content="Chat Failed")
            
    def test_add_message(self):
        message = self.conversation.add_message(user=self.user1, content="Hey it's me, wanna chat?")
        self.assertEqual(message.message_content, "Hey it's me, wanna chat?")
        self.assertEqual(message.user_id, self.user1)
        
    def test_fetch_messages_empty(self):
        messages = self.conversation.fetch_messages()
        self.assertEqual(len(messages), 0)


    def test_fetch_messages_multiple(self):
        self.conversation.add_message(user=self.user1, content="First Message")
        self.conversation.add_message(user=self.user2, content="Second Message")
        messages = self.conversation.fetch_messages()
        self.assertEqual(len(messages), 2)
        self.assertEqual(messages[0]["Message Content"], "First Message")

    def test_add_participants_valid(self):
        conversation = Conversation.objects.create(creator_id=self.user1)
        conversation.participants.add(self.user1)

        user3 = User.objects.create_user(username="user3", password="password")
        conversation.add_participants(user3)
        self.assertIn(user3, conversation.participants.all(), "Participant was not added.")

    def test_add_participants_exceeds_limit(self):
        user3 = User.objects.create_user(username="user3", password="password")
        user4 = User.objects.create_user(username="user4", password="password")
        with self.assertRaises(ValueError):
            self.conversation.add_participants(user3, user4)
            
    def test_add_participants_success(self):
        new_convo = Conversation.objects.create(creator_id=self.user2)
        self.assertEqual(new_convo.participants.count(), 0)
        new_convo.add_participants(self.user1)
        self.assertEqual(new_convo.participants.count(), 1)

class MessageModelTest(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username="user1", password="password")
        self.conversation = Conversation.objects.create(creator_id=self.user1)
        self.message = Message.objects.create(conversation_id=self.conversation,user_id=self.user1,message_content="Message")

    def test_message_string_representation(self):
        self.assertEqual(str(self.message), str(self.message.message_id))

    def test_message_fields(self):
        self.assertEqual(self.message.message_content, "Message")
        self.assertEqual(self.message.user_id, self.user1)


