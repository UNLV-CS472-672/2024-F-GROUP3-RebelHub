from django.test import TestCase
from django.contrib.auth.models import User
from django.utils import timezone
from datetime import timedelta
from .models import Comment
from Posts.models import Post
from hubs.models import Hub
from Comments.serializers import CommentSerializer, CommentCreateSerializer, LikeCommentSerializer, DislikeCommentSerializer
from rest_framework.test import APITestCase, APIClient, APIRequestFactory
from django.urls import reverse
from rest_framework import status
from Comments.filter import inappropriate_language_filter


# Test cases for Modles.py
class CommentModelTestCases(TestCase):
    # Set up a user and hub
    def setUp(self):
        self.user = User.objects.create_user(username='USERTEST', password='TESTPASS')
        self.hub = Hub.objects.create(name='TEST Hub', description='TESTING HUB', owner=self.user)
        self.post = Post.objects.create(title='TESTING Post',message='TESTING THIS POST MESSAGE',author=self.user,hub=self.hub)
        self.comment = Comment.objects.create(message="TESTING Comment",author=self.user,post=self.post)

    # Checking comment and then replying to comment
    def test_setup_comment(self):
        self.assertEqual(self.comment.message, "TESTING Comment")
        self.assertEqual(self.comment.author, self.user)
        self.assertEqual(self.comment.post, self.post)
       
    def test_replying_to_comment(self):
        reply = Comment.objects.create(message="TESTING REPLY MESSAGE", author=self.user,
            post=self.post, comment_reply=self.comment)
        self.assertEqual(reply.comment_reply, self.comment)
        self.assertEqual(reply.post, self.post)
           
    def test_string_representation(self):
        self.assertEqual( str(self.comment),  f"Comment by: {self.user.username} on post: {self.post.title}")


    def test_timestamp_ordering(self):
        com2 = Comment.objects.create(message="New test comment", author=self.user,post=self.post,)
        self.comment.timestamp = timezone.now() - timedelta(minutes=5)
        self.comment.save()
        com2.timestamp = timezone.now()
        com2.save()
        comments = Comment.objects.all().order_by('-timestamp')
        self.assertEqual(comments.first(), com2)
        self.assertEqual(comments.last(), self.comment)
       
#Test cases for Serializers.py
class CommentSerializerTests(APITestCase):
    def setUp(self):
        self.factory = APIRequestFactory()
        self.user = User.objects.create_user(username="TestUser", password="TestPassword")
        self.hub = Hub.objects.create(name="Test Hub", description="Testing Hub", owner=self.user)
        self.post = Post.objects.create(title="Test Post", author=self.user, hub=self.hub)
        self.comment = Comment.objects.create(post=self.post, author=self.user, message="Test Comment")
        self.reply = Comment.objects.create(post=self.post, author=self.user, message="Test Reply", comment_reply=self.comment)
        self.request = self.factory.get("/")
        self.request.user = self.user


    def test_get_replies(self):
        serializer = CommentSerializer(instance=self.comment, context={"request": self.request})
        self.assertIn("replies", serializer.data)
        self.assertEqual(len(serializer.data["replies"]), 1)

    def test_to_representation(self):
        serializer = CommentSerializer(instance=self.comment, context={"request": self.request})
        self.assertIn("is_author", serializer.data)
        self.assertTrue(serializer.data["is_author"])


    def test_like_comment(self):
        serializer = LikeCommentSerializer(
            instance=self.comment, data={}, context={"request": self.request})
        self.assertTrue(serializer.is_valid())
        updated_comment = serializer.save()
        self.assertIn(self.user, updated_comment.likes.all())

    def test_dislike_comment(self):
        serializer = DislikeCommentSerializer(instance=self.comment, data={}, context={"request": self.request})
        self.assertTrue(serializer.is_valid())
        updated_comment = serializer.save()
        self.assertIn(self.user, updated_comment.dislikes.all())

    def test_validate_like_already_liked(self):
        self.comment.likes.add(self.user)
        serializer = LikeCommentSerializer(instance=self.comment, data={}, context={"request": self.request})
        self.assertTrue(serializer.is_valid())
        result = serializer.validate({})
        self.assertFalse(result["making_like"])


    def test_validate_dislike_already_disliked(self):
        self.comment.dislikes.add(self.user)
        serializer = DislikeCommentSerializer(instance=self.comment, data={}, context={"request": self.request})
        self.assertTrue(serializer.is_valid())
        result = serializer.validate({})
        self.assertFalse(result["making_dislike"])


# Test cases for views.py
class CommentViewTestsCase(APITestCase):
    def setUp(self):
        # setup with user, hub, and posts
        self.client = APIClient()
        self.user = User.objects.create_user(username="TestUser", password="TestPassword")
        self.hub_owner = User.objects.create_user(username="TestHubOwner", password="TestPassword")
        self.moderator = User.objects.create_user(username="TestModerator", password="TestPassword")
        self.hub = Hub.objects.create(name="Test Hub", description="A hub for testing", owner=self.hub_owner)
        self.hub.mods.add(self.moderator)
        self.hub.members.add(self.user)
        self.post = Post.objects.create(title="Test Post", author=self.user, hub=self.hub)
       
        # Comments
        self.comment = Comment.objects.create(post=self.post, author=self.user, message="Test Comment")
        self.reply = Comment.objects.create(post=self.post, author=self.user, message="Test Reply", comment_reply=self.comment)
        self.client.force_authenticate(user=self.user)

    def test_comment_list(self):
        url = reverse("comment-list", kwargs={"post_id": self.post.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  
        self.assertEqual(response.data[0]["id"], self.comment.id)

    def test_comment_details(self):
        url = reverse("comment-detail", kwargs={"comment_id": self.comment.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["id"], self.comment.id)
        self.assertEqual(response.data["message"], self.comment.message)

    def test_like_comment(self):
        url = reverse("like-comment", kwargs={"comment_id": self.comment.id})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["likes"], 1)
        self.assertEqual(response.data["dislikes"], 0)

    def test_dislike_comment(self):
        url = reverse("dislike-comment", kwargs={"comment_id": self.comment.id})
        response = self.client.patch(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data["likes"], 0)
        self.assertEqual(response.data["dislikes"], 1)

    def test_comment_replies_list(self):
        url = reverse("comment-list-create", kwargs={"comment_id": self.comment.id})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1)  
        self.assertEqual(response.data[0]["id"], self.reply.id)
        
    def test_comments_order_listed_by_likes(self):
        self.comment.likes.add(self.user)
        url = f"{reverse('comment-list', kwargs={'post_id': self.post.id})}?order_by=likes"
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data[0]["id"], self.comment.id)

    def test_invalid_reply_id(self):
        url = reverse("comment-list-create", kwargs={"comment_id": 9999})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 0)  
        
        
