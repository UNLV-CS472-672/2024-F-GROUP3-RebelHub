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
        self.post1 = self.create_post(title="Post 1", message="Content for post 1", hub="Hub 1")
        self.post2 = self.create_post(title="Post 2", message="Content for post 2", hub="Hub 2")
        
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
        self.assertEqual(response.data[0]['title'], 'Post 1')
        self.assertEqual(response.data[1]['title'], 'Post 2')

    # Check if API can create new post
    def test_create_post(self):
        data = {
            'title': 'New Post',
            'message': 'This is the content of the new post.',
            'hub': 'General'
        }
        response = self.client.post(reverse('post-create'), data, format='json')
        
        print(response.data)  
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)  
        self.assertEqual(Post.objects.count(), 3)  

        # Other assertions for the created post
        new_post = Post.objects.latest('id')
        self.assertEqual(new_post.title, 'New Post')
        self.assertEqual(new_post.message, 'This is the content of the new post.')
        self.assertEqual(new_post.hub, 'General')


# Test liking a post
def test_like_post(self):
    url = reverse('like-post', kwargs={'post_id': self.post1.pk})
    response = self.client.post(url)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.post1.refresh_from_db()
    self.assertEqual(self.post1.likes, 1)

# Test disliking a post
def test_dislike_post(self):
    url = reverse('dislike-post', kwargs={'post_id': self.post1.pk})
    response = self.client.post(url)
    self.assertEqual(response.status_code, status.HTTP_200_OK)
    self.post1.refresh_from_db()
    self.assertEqual(self.post1.dislikes, 1)  

