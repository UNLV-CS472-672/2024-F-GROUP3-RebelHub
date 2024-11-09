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
        #self.post1 = Post.objects.create(title="Loving UNLV", message="I love UNLV", hub="Hub 1")
        #self.post2 = Post.objects.create(title="Loving CS", message="I love CS 135", hub="Hub 2")

        self.edit_user = User.objects.create_user(username='edit_hub_user', password='password')
        self.edit_user_client = APIClient()
        self.edit_user_client.force_authenticate(user=self.edit_user)

        self.edit_hub_owner = User.objects.create_user(username='edit_hub_owner', password='password')
        self.edit_hub_owner_client = APIClient()
        self.edit_hub_owner_client.force_authenticate(user=self.edit_hub_owner)

        self.edit_hub_mod = User.objects.create_user(username='edit_hub_mod', password='password')
        self.edit_hub_mod_client = APIClient()
        self.edit_hub_mod_client.force_authenticate(user=self.edit_hub_mod)

        self.edit_hub = Hub.objects.create(name='edit_hub', description='A hub to test editing', owner=self.edit_hub_owner)
        self.edit_hub.mods.add(self.edit_hub_mod)
        self.edit_hub.members.add(self.edit_user, self.edit_hub_mod)

        self.edit_dummy_post = {'title': "edit post title user", 'message': "edit post message user", 'hub_id': self.edit_hub.id}


        self.dummy_post = {'title': "DUMMY POST", 'message': "THIS IS A DUMMY POST"} #MUST ADD "hub_id" KEY
        self.dummy_post2 = {'title': "DUMMY POST 2", 'message': "THIS IS A SECOND DUMMY POST"} # MUST ADD 'hub_id' key
        self.factory = APIRequestFactory()
        
    def test_user_edit_their_post(self):
        """
        Make sure a user can edit their own posts.
        """
        response = self.edit_user_client.post(reverse('post-create'), self.edit_dummy_post, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Post was not created")

        new_data = {'title': "edited title", 'message': "edited message"}

        response = self.edit_user_client.patch(reverse('post-edit', kwargs={'id': response.data['id']}), new_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK, "Post could not be edited by post author")
        self.assertEqual(response.data['title'], new_data['title'], "Post title did not change")
        self.assertEqual(response.data['message'], new_data['message'], "Post message did not change")
    
    def test_mod_edit_hub_post(self):
        """
        Make sure that a mod can edit posts on a hub that they moderate.
        """
        response = self.edit_user_client.post(reverse('post-create'), self.edit_dummy_post, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Post was not created")

        new_data = {'title': "edited title", 'message': "edited message"}

        response = self.edit_hub_mod_client.patch(reverse('post-edit', kwargs={'id': response.data['id']}), new_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK, "Post could not be edited by hub mod")
        self.assertEqual(response.data['title'], new_data['title'], "Post title did not change")
        self.assertEqual(response.data['message'], new_data['message'], "Post message did not change")
    
    def test_owner_edit_hub_post(self):
        """
        Make sure that an owner can edit posts on a hub that they own.
        """
        response = self.edit_user_client.post(reverse('post-create'), self.edit_dummy_post, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Post was not created")

        new_data = {'title': "edited title", 'message': "edited message"}

        response = self.edit_hub_owner_client.patch(reverse('post-edit', kwargs={'id': response.data['id']}), new_data, format='json')

        self.assertEqual(response.status_code, status.HTTP_200_OK, "Post could not be edited by post author")
        self.assertEqual(response.data['title'], new_data['title'], "Post title did not change")
        self.assertEqual(response.data['message'], new_data['message'], "Post message did not change")

    def test_user_cannot_edit_unowned_post(self):
        """
        Make sure that a random hub member cannot edit posts that are not theirs.
        """
        response = self.edit_hub_mod_client.post(reverse('post-create'), self.edit_dummy_post, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Post was not created")
        made_post_id = response.data['id']

        new_data = {'title': "edited title", 'message': "edited message"}

        response = self.edit_user_client.patch(reverse('post-edit', kwargs={'id': made_post_id}), new_data, format='json')
        made_post = Post.objects.get(id=made_post_id)

        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, "Post was edited by someone unauthorized")
        self.assertEqual(made_post.title, self.edit_dummy_post['title'], "Post title changed")
        self.assertEqual(made_post.message, self.edit_dummy_post['message'], "Post message changed")
    
    def test_user_cannot_remove_post_title_or_message(self):
        """
        Make sure that a user cannot remove the title or message from a post.
        """
        response = self.edit_user_client.post(reverse('post-create'), self.edit_dummy_post, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Post was not created")
        made_post_id = response.data['id']

        new_data = {'title': "", 'message': "edited message"}

        response = self.edit_user_client.patch(reverse('post-edit', kwargs={'id': made_post_id}), new_data, format='json')
        made_post = Post.objects.get(id=made_post_id)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, "Post was edited to have no title")
        self.assertEqual(made_post.title, self.edit_dummy_post['title'], "Post title changed")
        self.assertEqual(made_post.message, self.edit_dummy_post['message'], "Post message changed")

        new_data = {'title': "edited title", 'message': ""}

        response = self.edit_user_client.patch(reverse('post-edit', kwargs={'id': made_post_id}), new_data, format='json')
        made_post = Post.objects.get(id=made_post_id)

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, "Post was edited to have no message")
        self.assertEqual(made_post.title, self.edit_dummy_post['title'], "Post title changed")
        self.assertEqual(made_post.message, self.edit_dummy_post['message'], "Post message changed")

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

        request = self.factory.get("posts/")
        force_authenticate(request, user=user2)
        view = PostList.as_view()
        response = view(request)
        data = response.data
        self.assertEqual(data[0]["is_author"], True)
        self.assertEqual(data[0]["is_liked"], False)
        self.assertEqual(data[0]["is_disliked"], False)

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

        request = self.factory.get(f"posts/{made_post.id}/")
        force_authenticate(request, user=user)
        view = PostDetail.as_view()
        response = view(request, id=made_post.id)
        data = response.data

        self.assertEqual(data["is_liked"], True)
        self.assertEqual(data["is_author"], True)

        
        request = self.factory.put(f"posts/{made_post.id}/like/")
        force_authenticate(request, user=user)
        view = LikePost.as_view()
        response = view(request, id=made_post.id)
        data = response.data
        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user could like/unlike
        self.assertEqual(made_post.likes.count(), 0) # back to zero if they like again

        request = self.factory.get(f"posts/{made_post.id}/")
        force_authenticate(request, user=user)
        view = PostDetail.as_view()
        response = view(request, id=made_post.id)
        data = response.data

        self.assertEqual(data["is_liked"], False)
        self.assertEqual(data["is_author"], True)
     

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


    # Test for string representation of the post
    def test_post_string_representation(self):
        user = self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        post = Post(title="CS Professors", message="What Professor should I take for CS 135?", hub=hub, author=self.user)
        self.assertEqual(str(post), post.title)

    # Test deleting a post without proper authentication
    def test_unauthenticate_post_deleting(self):
        user = self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        post = Post.objects.create(title="CS Professors", message="What Professor should I take for CS 135?", hub=hub, author=user)
        request = self.factory.delete(f"posts/{post.id}/delete/")
        view = PostDelete.as_view()
        resp = view(request, id=post.id)

        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED, "Unauthenticated user is deleting post")
        post_exists = Post.objects.filter(id=post.id).exists()
        self.assertTrue(post_exists, "This post was not deleted : unauthenticated user")

 
""" 
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

   # Test creating a post with missing fields such as a title
    def test_create_post_missing_fields(self):
        data = {'message': 'This post needs a title', 'hub': 'General'}
        response = self.client.post(reverse('post-create'), data, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, "Post created with a missing title")
"""
