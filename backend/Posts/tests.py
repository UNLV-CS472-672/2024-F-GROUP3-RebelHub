from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate
from .models import Post
from .views import *
from hubs.models import Hub
from django.contrib.auth.models import User

# Class to test Post
class PostTestCase(TestCase):
    # Function to set up test user data by creating a test user and logs them in.
    def setUp(self):
        
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)  

        # Use helper method to create initial posts
        #self.post1 = self.create_post(title="Loving UNLV", message="I love UNLV", hub="Hub 1")
        #self.post2 = self.create_post(title="Loving CS", message="I love CS 135", hub="Hub 2")

        self.dummy_post = {'title': "DUMMY POST", 'message': "THIS IS A DUMMY POST"} #MUST ADD "hub_id" KEY
        self.dummy_post2 = {'title': "DUMMY POST 2", 'message': "THIS IS A SECOND DUMMY POST"} # MUST ADD 'hub_id' key
        self.factory = APIRequestFactory()
        

    def test_get_post_list(self):
        """
        Make sure authenticated users can grab everypost (prolly shouldn't be used)
        """
        user = self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        dummy_post = self.dummy_post
        dummy_post["hub_id"] = hub.id
        request = self.factory.post("posts/create/", dummy_post, format="json")
        force_authenticate(request, user=user)
        view = CreatePost.as_view()
        response = view(request)
        data = response.data

        user2 = User.objects.create_user(username='test user 2', password='testpass')
        hub2 = Hub.objects.create(name="TEST HUB 2", description="TEST HUB DESC", owner=user2)
        dummy_post = self.dummy_post2
        dummy_post["hub_id"] = hub2.id
        request = self.factory.post("posts/create/", dummy_post, format="json")
        force_authenticate(request, user=user2)
        view = CreatePost.as_view()
        response = view(request)
        data = response.data

        user3 = User.objects.create_user(username='test user 3', password='testpass')
        hub2.members.add(user3)

        request = self.factory.get("posts/")
        force_authenticate(request, user=user3)
        view = PostList.as_view()
        response = view(request)
        data = response.data

        self.assertEqual(len(data), 1)

    def test_get_single_post(self):
        """
        Make sure auth users can see a detailed post by id.
        """
        user = self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        dummy_post = self.dummy_post
        dummy_post["hub_id"] = hub.id
        request = self.factory.post("posts/create/", dummy_post, format="json")
        force_authenticate(request, user=user)
        view = CreatePost.as_view()
        response = view(request)
        data = response.data
        made_post = Post.objects.get(message=data["message"])

        user2 = User.objects.create_user(username='test user 2', password='testpass')
        request = self.factory.get(f"posts/{made_post.id}/")
        force_authenticate(request, user=user2)
        view = PostDetail.as_view()
        response = view(request, id=made_post.id)
        data = response.data

        self.assertEqual(data["title"], dummy_post["title"])

    def test_get_single_post_private(self):
        """
        Make sure unauth users cannot see a detailed post from a private hub
        """
        user = self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", private_hub=True, owner=user)
        dummy_post = self.dummy_post
        dummy_post["hub_id"] = hub.id
        request = self.factory.post("posts/create/", dummy_post, format="json")
        force_authenticate(request, user=user)
        view = CreatePost.as_view()
        response = view(request)
        data = response.data
        made_post = Post.objects.get(message=data["message"])

        user2 = User.objects.create_user(username='test user 2', password='testpass')
        request = self.factory.get(f"posts/{made_post.id}/")
        view = PostDetail.as_view()
        response = view(request, id=made_post.id)
        data = response.data
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND) #404 no post is returned since the post belong to private hub.


    def test_create_post(self):
        """
        Make sure a user can creae a post if they are a hub member
        """
        user = self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        dummy_post = self.dummy_post
        dummy_post["hub_id"] = hub.id
        request = self.factory.post("posts/create/", dummy_post, format="json")
        force_authenticate(request, user=user)
        view = CreatePost.as_view()
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_201_CREATED) #201 user could create a post 

        made_post = Post.objects.get(message=data["message"])
        self.assertEqual(made_post.author, user)

    def test_create_post_bad_fields(self):
        """
        Make sure a user cannot creae a post if there are bad fields
        """
        user = self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        dummy_post = self.dummy_post
        #never added hub id to dummy post
        request = self.factory.post("posts/create/", dummy_post, format="json")
        force_authenticate(request, user=user)
        view = CreatePost.as_view()
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST) #400 user wansn't able to make a post cus of the bad fields (missing hub id) 


    def test_create_post_not_a_member(self):
        """
        Make sure user cannot create a post if they are not a hub member
        """
        user = self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        dummy_post = self.dummy_post
        dummy_post["hub_id"] = hub.id

        user2 = User.objects.create_user(username='test user 2', password='testpass')

        request = self.factory.post("posts/create/", dummy_post, format="json")
        force_authenticate(request, user=user2)
        view = CreatePost.as_view()
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) #403 user could not create a post since user2 not a member in hub

    def test_delete_post(self):
        """
        Make sure a user can delete a post
        """
        user = self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        dummy_post = self.dummy_post
        dummy_post["hub_id"] = hub.id

        request = self.factory.post("posts/create/", dummy_post, format="json")
        force_authenticate(request, user=user)
        view = CreatePost.as_view()
        response = view(request)
        data = response.data
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) #201 user could create a post 
        made_post = Post.objects.get(message=data["message"])

        request = self.factory.delete(f"posts/{made_post.id}/delete/")
        force_authenticate(request, user=user)
        view = PostDelete.as_view()
        response = view(request, id=made_post.id)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT) #204 user successfully deleted post
        self.assertEqual(Post.objects.count(), 0) #no more posts exist

    def test_delete_post_not_author(self):
        """
        Make sure a user cant delete a post they didnt create
        """
        user = self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        dummy_post = self.dummy_post
        dummy_post["hub_id"] = hub.id

        request = self.factory.post("posts/create/", dummy_post, format="json")
        force_authenticate(request, user=user)
        view = CreatePost.as_view()
        response = view(request)
        data = response.data
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) #201 user could create a post 
        made_post = Post.objects.get(message=data["message"])


        #user2 tries deleting post user made
        user2 = User.objects.create_user(username='test user 2', password='testpass')
        request = self.factory.delete(f"posts/{made_post.id}/delete/")
        force_authenticate(request, user=user2)
        view = PostDelete.as_view()
        response = view(request, id=made_post.id)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) #403 user could not delte post
        self.assertEqual(Post.objects.count(), 1) #post still exists

    def test_delete_post_owner(self):
        """
        Make sure hub owner can delete any posts.
        """
        user = self.user
        user2 = User.objects.create_user(username='test user 2', password='testpass')
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        hub.members.add(user2)
        dummy_post = self.dummy_post
        dummy_post["hub_id"] = hub.id

        request = self.factory.post("posts/create/", dummy_post, format="json")
        force_authenticate(request, user=user2)
        view = CreatePost.as_view()
        response = view(request)
        data = response.data
        self.assertEqual(response.status_code, status.HTTP_201_CREATED) #201 user could create a post 
        made_post = Post.objects.get(message=data["message"])

        request = self.factory.delete(f"posts/{made_post.id}/delete/")
        force_authenticate(request, user=user)
        view = PostDelete.as_view()
        response = view(request, id=made_post.id)

        self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT) #204 user successfully deleted post
        self.assertEqual(Post.objects.count(), 0) #no more posts exist

    def test_like_post(self):
        """
        Make sure a user can like a post only once...
        """
        user = self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        dummy_post = self.dummy_post
        dummy_post["hub_id"] = hub.id
        request = self.factory.post("posts/create/", dummy_post, format="json")
        force_authenticate(request, user=user)
        view = CreatePost.as_view()
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_201_CREATED) #201 user could create a post 

        made_post = Post.objects.get(message=data["message"])
        self.assertEqual(made_post.likes.count(), 0)

        request = self.factory.put(f"posts/{made_post.id}/like/")
        force_authenticate(request, user=user)
        view = LikePost.as_view()
        response = view(request, id=made_post.id)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user could like/unlike
        self.assertEqual(made_post.likes.count(), 1)
        
        request = self.factory.put(f"posts/{made_post.id}/like/")
        force_authenticate(request, user=user)
        view = LikePost.as_view()
        response = view(request, id=made_post.id)
        data = response.data
        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user could like/unlike
        self.assertEqual(made_post.likes.count(), 0) # back to zero if they like again
     

    def test_dislike_post(self):
        """
        Make sure a user can dislike a post only once...
        """
        user = self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        dummy_post = self.dummy_post
        dummy_post["hub_id"] = hub.id
        request = self.factory.post("posts/create/", dummy_post, format="json")
        force_authenticate(request, user=user)
        view = CreatePost.as_view()
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_201_CREATED) #201 user could create a post 

        made_post = Post.objects.get(message=data["message"])
        self.assertEqual(made_post.likes.count(), 0)

        request = self.factory.put(f"posts/{made_post.id}/dislike/")
        force_authenticate(request, user=user)
        view = DislikePost.as_view()
        response = view(request, id=made_post.id)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user could dislike/undislike
        self.assertEqual(made_post.dislikes.count(), 1)
        self.assertEqual(user.disliked_posts.count(), 1)
        
        request = self.factory.put(f"posts/{made_post.id}/dislike/")
        force_authenticate(request, user=user)
        view = DislikePost.as_view()
        response = view(request, id=made_post.id)
        data = response.data
        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user could dislike/undislike
        self.assertEqual(made_post.dislikes.count(), 0) # back to zero if they dislike again
        self.assertEqual(user.disliked_posts.count(), 0)
     

    def test_likedislike_not_member(self):
        """
        Make sure a user can't like or dislike if they are not a hub member
        """
        user = self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        dummy_post = self.dummy_post
        dummy_post["hub_id"] = hub.id
        request = self.factory.post("posts/create/", dummy_post, format="json")
        force_authenticate(request, user=user)
        view = CreatePost.as_view()
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_201_CREATED) #201 user could create a post
        made_post = Post.objects.get(message=data["message"])

        user2 = User.objects.create_user(username='test user 2', password='testpass')

        request = self.factory.put(f"posts/{made_post.id}/like/")
        force_authenticate(request, user=user2)
        view = LikePost.as_view()
        response = view(request, id=made_post.id)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) #403 user could NOT dislike/undislike
        self.assertEqual(made_post.likes.count(), 0)

        request = self.factory.put(f"posts/{made_post.id}/dislike/")
        force_authenticate(request, user=user2)
        view = DislikePost.as_view()
        response = view(request, id=made_post.id)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN) #403 user could NOT dislike/undislike
        self.assertEqual(made_post.dislikes.count(), 0)

    def test_like_then_dislike(self):
        """
        Make sure if a user has liked then dislikes, likes gets updated
        """
        user = self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        dummy_post = self.dummy_post
        dummy_post["hub_id"] = hub.id
        request = self.factory.post("posts/create/", dummy_post, format="json")
        force_authenticate(request, user=user)
        view = CreatePost.as_view()
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_201_CREATED) #201 user could create a post
        made_post = Post.objects.get(message=data["message"])

        request = self.factory.put(f"posts/{made_post.id}/like/")
        force_authenticate(request, user=user)
        view = LikePost.as_view()
        response = view(request, id=made_post.id)
        data = response.data

        self.assertEqual(made_post.likes.count(), 1)
        self.assertEqual(user.liked_posts.count(), 1)

        request = self.factory.put(f"posts/{made_post.id}/dislike/")
        force_authenticate(request, user=user)
        view = DislikePost.as_view()
        response = view(request, id=made_post.id)
        data = response.data

        self.assertEqual(made_post.likes.count(), 0)
        self.assertEqual(made_post.dislikes.count(), 1)
        self.assertEqual(user.liked_posts.count(), 0)
        self.assertEqual(user.disliked_posts.count(), 1)

    def test_dislike_then_like(self):
        """
        Make sure if a user has disliked then likes, dislikes gets updated
        """
        user = self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        dummy_post = self.dummy_post
        dummy_post["hub_id"] = hub.id
        request = self.factory.post("posts/create/", dummy_post, format="json")
        force_authenticate(request, user=user)
        view = CreatePost.as_view()
        response = view(request)
        data = response.data

        self.assertEqual(response.status_code, status.HTTP_201_CREATED) #201 user could create a post
        made_post = Post.objects.get(message=data["message"])

        request = self.factory.put(f"posts/{made_post.id}/dislike/")
        force_authenticate(request, user=user)
        view = DislikePost.as_view()
        response = view(request, id=made_post.id)
        data = response.data

        self.assertEqual(made_post.dislikes.count(), 1)

        request = self.factory.put(f"posts/{made_post.id}/like/")
        force_authenticate(request, user=user)
        view = LikePost.as_view()
        response = view(request, id=made_post.id)
        data = response.data

        self.assertEqual(made_post.dislikes.count(), 0)
        self.assertEqual(made_post.likes.count(), 1)


"""    
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
"""
