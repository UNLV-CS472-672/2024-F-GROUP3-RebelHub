from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Post
from django.contrib.auth.models import User

# Class to test Post
class PostTestCase(TestCase):
    
    # Function to set up test user data by creating a test user and logs them in.
    def setUp(self):
        
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)  

        # Use helper method to create initial posts
        self.post1 = self.create_post(title="Loving UNLV", message="I love UNLV", hub="Hub 1")
        self.post2 = self.create_post(title="Loving CS", message="I love CS 135", hub="Hub 2")
        
    # Function to create a post. This will act as a helper method
    def create_post(self, title, message, hub):
        return Post.objects.create(author=self.user, title=title, message=message, hub=hub)

    # Function to test if all posts can be listed in the API
    def test_post_list(self):
        # The response calls the /posts/ endpoint
        response = self.client.get(reverse('post-list'))  
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
        # Using 2 posts, and seeing if both posts are listed
        self.assertEqual(len(response.data), 2) 
        self.assertEqual(response.data[0]['title'], 'Loving UNLV')
        self.assertEqual(response.data[1]['title'], 'Loving CS')

    # Check if API can create new post
    def test_create_post(self):
        data = { 'title': 'CS Classes', 'message': 'What CS classes should I take?','hub': 'CS' }
        response = self.client.post(reverse('post-create'), data, format='json')
        
        print(response.data)  
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)  
        self.assertEqual(Post.objects.count(), 3)  

        # Other assertions for the created post
        new_post = Post.objects.latest('id')
        self.assertEqual(new_post.title, 'CS Classes')
        self.assertEqual(new_post.message, 'What CS classes should I take?')
        self.assertEqual(new_post.hub, 'CS')

    # Test for string representation of the post
    def test_post_string_representation(self):
        post = Post(title="CS Professors", message="What Professor should I take for CS 135?", hub="CS", author=self.user)
        self.assertEqual(str(post), post.title)
    
    # Test getting a single post by ID
    def test_get_single_post(self):
        url = reverse('post-detail', kwargs={'post_id': self.post1.pk})
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], self.post1.title)

    # Test deleting a post
    def test_deleting_post(self):
        url = reverse('post-delete', kwargs={'post_id': self.post1.pk})
        response = self.client.delete(url)
        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
        self.assertFalse(Post.objects.filter(id=self.post1.pk).exists())
        
    # Test liking a post
    def test_liking_post(self):
        url = reverse('like-post', kwargs={'post_id': self.post1.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, "Failed to like this post")
        self.post1.refresh_from_db()
        self.assertEqual(self.post1.likes, 1)

    # Test disliking a post
    def test_disliking_post(self):
        url = reverse('dislike-post', kwargs={'post_id': self.post1.pk})
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_200_OK, "Failed to dislike this post")
        self.post1.refresh_from_db()
        self.assertEqual(self.post1.dislikes, 1)

    # Test liking an invalid post (not found)
    def test_liking_invalid_post(self):
        url = reverse('like-post', kwargs={'post_id': 999999})  
        response = self.client.post(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND, "Liking an invalid post")

    # Test deleting a post without proper authentication
    def test_unauthenticate_post_deleting(self):
        self.client.logout()
        url = reverse('post-delete', kwargs={'post_id': self.post1.id})
        resp = self.client.delete(url)
        self.assertEqual(resp.status_code, status.HTTP_403_FORBIDDEN, "Unauthenticated user is deleting post")
        post_exists = Post.objects.filter(id=self.post1.id).exists()
        self.assertTrue(post_exists, "This post was deleted by an unauthenticated user")

    # Test creating a post with missing fields such as a title
    def test_create_post_missing_fields(self):
        data = {'message': 'This post needs a title', 'hub': 'General'}
        response = self.client.post(reverse('post-create'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, "Post created with a missing title")

