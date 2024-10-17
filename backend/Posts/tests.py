from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from .models import Post
from django.contrib.auth.models import User

# Class to test Post
class PostTestCase(TestCase):
    
    # Function to set up test user data
    def setUp(self):
        # Creates a test user and logs them in, also creates two posts.
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client = APIClient()
        # Automatically logs in the test user
        self.client.force_authenticate(user=self.user)  

        # Use helper method to create initial posts
        self.post1 = self.create_post(title="Post 1", message="Content for post 1", hub="Hub 1")
        self.post2 = self.create_post(title="Post 2", message="Content for post 2", hub="Hub 2")
        
    # Cleanup method to reset test database after each test
    def tearDown(self):
        Post.objects.all().delete()
        
    # Function to create a post. This will act as a helper method, such as used right above in the setUp function.
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

    # Check if API can create a new post
    def test_create_post(self):
        # This is the post data that has the title, message, and hub category
        data = {
            'title': 'New Post',
            'message': 'This is the content of the new post.',
            'hub': 'General'
        }
        response = self.client.post(reverse('post-create'), data, format='json')
        
        # To print response data
        print(response.data)  
        # 201 for a created response
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)  
        # Checking if the new post is added
        self.assertEqual(Post.objects.count(), 3)  

        # Other assertions for the created post
        new_post = Post.objects.latest('id')
        self.assertEqual(new_post.title, 'New Post')
        self.assertEqual(new_post.message, 'This is the content of the new post.')
        self.assertEqual(new_post.hub, 'General')
        
        # Check the default values for likePost and dislikePost
        self.assertEqual(new_post.likePost, 0)
        self.assertEqual(new_post.dislikePost, 0)
    
    # Function to test the string representation (__str__) of a post, to check if readable 
    def test_post_str(self):
        post = Post.objects.create(author=self.user, title="Post Title", message="Post content", hub="General")
        self.assertEqual(str(post), "Post Title")
