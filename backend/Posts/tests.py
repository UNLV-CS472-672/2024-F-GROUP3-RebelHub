from datetime import datetime
from django.test import TestCase
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient, APIRequestFactory, force_authenticate
from .models import Post
from .views import *
from Posts.models import Post
from hubs.models import Hub
from django.contrib.auth.models import User
from django.conf import settings
from django.utils import timezone
from datetime import timedelta
from Posts.helper import filter_queryset, set_hot_score, calculate_hot_score, calculate_time_factor
from Posts.filter import inappropriate_language_filter

class FilterFunctionTestCase(TestCase):
    def test_inappropriate_language_filter(self):
        self.assertTrue(inappropriate_language_filter("Shit post"))
        self.assertTrue(inappropriate_language_filter("fuck"))
        self.assertTrue(inappropriate_language_filter("BITCH"))
        self.assertTrue(inappropriate_language_filter("crap."))

        self.assertFalse(inappropriate_language_filter("Nice, and this is a clean post."))
        self.assertFalse(inappropriate_language_filter("Nothing bad here."))
        self.assertFalse(inappropriate_language_filter("What a nice day."))
        
class HelperFunctionsTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.hub = Hub.objects.create(name="Test Hub", description="Test hub for posts", owner=self.user)
        self.hub.members.add(self.user)
        
        now = timezone.now()
        self.post1 = Post.objects.create(title="Post 1", message="Message 1", hub=self.hub, author=self.user, timestamp=now - timedelta(hours=3))
        self.post2 = Post.objects.create(title="Post 2", message="Message 2", hub=self.hub, author=self.user, timestamp=now - timedelta(days=2))
        
        self.factory = APIRequestFactory()

    def test_calculate_hot_score(self):
        comment1 = self.post1.comments.create(author=self.user, message="Comment 1")
        comment2 = self.post1.comments.create(author=self.user, message="Comment 2")
        comments = self.post1.comments.all()
        hot_score = calculate_hot_score(10, comments, timezone.now() - timedelta(hours=1))
        self.assertGreater(hot_score, 0)

    def test_calculate_time_factor(self):
        now = timezone.now()
        self.assertEqual(calculate_time_factor(now), 5)  
        self.assertEqual(calculate_time_factor(now - timedelta(hours=8)), 4.5)  
        self.assertEqual(calculate_time_factor(now - timedelta(days=10)), 0.1)  

    


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

        self.date = "2024-11-17T10:00:00Z"

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
        
    def test_user_can_edit_their_post(self):
        """
        Make sure a user can edit their own posts.
        """
        response = self.edit_user_client.post(reverse('post-create'), self.edit_dummy_post, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Post was not created")

        new_data = {'title': "edited title", 'message': "edited message", 'last_edited': self.date}

        response = self.edit_user_client.patch(reverse('post-edit', kwargs={'id': response.data['id']}), new_data, format='json')

        # Check if the post author was able to change the post. If they weren't, then state what couldn't be changed.
        self.assertEqual(response.status_code, status.HTTP_200_OK, "Post could not be edited by post author")
        self.assertEqual(response.data['title'], new_data['title'], "Post title did not change")
        self.assertEqual(response.data['message'], new_data['message'], "Post message did not change")
        self.assertEqual(response.data['last_edited'], new_data['last_edited'], "Last edited did not change")
    
    def test_mod_cannot_edit_unowned_post(self):
        """
        Make sure that a mod cannot edit posts on a hub that they moderate.
        """
        response = self.edit_user_client.post(reverse('post-create'), self.edit_dummy_post, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Post was not created")
        post_id = response.data['id']

        new_data = {'title': "edited title", 'message': "edited message", 'last_edited': self.date}

        response = self.edit_hub_mod_client.patch(reverse('post-edit', kwargs={'id': post_id}), new_data, format='json')
        post = Post.objects.get(id=post_id)

        # Check that a mod cannot edit the post. The title and message should not change.
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, "Post could be edited by hub mod")
        self.assertNotEqual(post.title, new_data['title'], "Post title changed")
        self.assertNotEqual(post.message, new_data['message'], "Post message changed")
        self.assertNotEqual(post.last_edited, new_data['last_edited'], "Last edited changed")
    
    def test_owner_cannot_edit_unowned_post(self):
        """
        Make sure that an owner cannot edit posts on a hub that they own.
        """
        response = self.edit_user_client.post(reverse('post-create'), self.edit_dummy_post, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Post was not created")
        post_id = response.data['id']

        new_data = {'title': "edited title", 'message': "edited message", 'last_edited': self.date}

        response = self.edit_hub_owner_client.patch(reverse('post-edit', kwargs={'id': post_id}), new_data, format='json')
        post = Post.objects.get(id=post_id)

        # Check that an owner cannot edit the post. The title and message should not change.
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, "Post could be edited by hub owner")
        self.assertNotEqual(post.title, new_data['title'], "Post title changed")
        self.assertNotEqual(post.message, new_data['message'], "Post message changed")
        self.assertNotEqual(post.last_edited, new_data['last_edited'], "Last edited changed")

    def test_user_cannot_edit_unowned_post(self):
        """
        Make sure that a random hub member cannot edit posts that are not theirs.
        """
        response = self.edit_hub_mod_client.post(reverse('post-create'), self.edit_dummy_post, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Post was not created")
        post_id = response.data['id']

        new_data = {'title': "edited title", 'message': "edited message", 'last_edited': self.date}

        response = self.edit_user_client.patch(reverse('post-edit', kwargs={'id': post_id}), new_data, format='json')
        post = Post.objects.get(id=post_id)

        # Check that a user cannot edit the post. The title and message should not change.
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN, "Post was edited by someone unauthorized")
        self.assertNotEqual(post.title, new_data['title'], "Post title changed")
        self.assertNotEqual(post.message, new_data['message'], "Post message changed")
        self.assertNotEqual(post.last_edited, new_data['last_edited'], "Last edited changed")
    
    def test_user_cannot_remove_post_title_or_message(self):
        """
        Make sure that a user cannot remove the title or message from a post.
        """
        response = self.edit_user_client.post(reverse('post-create'), self.edit_dummy_post, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Post was not created")
        post_id = response.data['id']

        new_data = {'title': "", 'message': "edited message", 'last_edited': self.date}

        response = self.edit_user_client.patch(reverse('post-edit', kwargs={'id': post_id}), new_data, format='json')
        post = Post.objects.get(id=post_id)

        # Make sure the patch request did not change the post
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, "Post was edited to have no title")
        self.assertNotEqual(post.title, new_data['title'], "Post title changed")
        self.assertNotEqual(post.message, new_data['message'], "Post message changed")
        self.assertNotEqual(post.last_edited, new_data['last_edited'], "Last edited changed")

        new_data = {'title': "edited title", 'message': "", 'last_edited': self.date}

        response = self.edit_user_client.patch(reverse('post-edit', kwargs={'id': post_id}), new_data, format='json')
        post = Post.objects.get(id=post_id)

        # Make sure the patch request did not change the post
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, "Post was edited to have no message")
        self.assertNotEqual(post.title, new_data['title'], "Post title changed")
        self.assertNotEqual(post.message, new_data['message'], "Post message changed")
        self.assertNotEqual(post.last_edited, new_data['last_edited'], "Last edited changed")

    def test_edit_without_last_edited(self):
        """
        Make sure a post cannot be edited without the last_edited input
        """
        response = self.edit_user_client.post(reverse('post-create'), self.edit_dummy_post, format='json')
        
        self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Post was not created")
        post_id = response.data['id']

        new_data = {'title': "edited title", 'message': "edited message"}

        response = self.edit_user_client.patch(reverse('post-edit', kwargs={'id': post_id}), new_data, format='json')
        post = Post.objects.get(id=post_id)

        # Make sure the patch request did not change the post
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST, "Post edit did not have a last_edited field")
        self.assertNotEqual(post.title, new_data['title'], "Post title changed")
        self.assertNotEqual(post.message, new_data['message'], "Post message changed")
        self.assertEqual(post.last_edited, None, "Last edited changed")

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
    
    def test_sort_by_new_and_old_posts(self):
        user=self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)

        # Create post that was made 2 weeks ago.
        post1 = Post.objects.create(title="monkeys", message="Monkeys", hub=hub, author=user)
        post1.timestamp = timezone.now() - timedelta(weeks=2)
        post1.save()
        
        # Create post that was made 1 week ago.
        post2 = Post.objects.create(title="rabbit", message="rabbit", hub=hub, author=user)
        post2.timestamp = timezone.now() - timedelta(weeks=1)
        post2.save()

        # Create post that was made now.
        post3 = Post.objects.create(title="tacos", message="tacos", hub=hub, author=user)

        # Assert that there are three posts in order from newest to oldest
        response = self.client.get(reverse('explore-list') + '?time_range=all_time&ordering=new')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3) 
        self.assertEqual(response.data[0]['title'], "tacos")
        self.assertEqual(response.data[1]['title'], "rabbit")
        self.assertEqual(response.data[2]['title'], "monkeys")

        # Assert that there are three posts in order from oldest to newest
        response = self.client.get(reverse('explore-list') + '?time_range=all_time&ordering=old')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3) 
        self.assertEqual(response.data[0]['title'], "monkeys")
        self.assertEqual(response.data[1]['title'], "rabbit")
        self.assertEqual(response.data[2]['title'], "tacos")

        # Adjust timestamps of posts and check if the newest and oldest sort is working correctly
        post1.timestamp = timezone.now()
        post1.save()
        post2.timestamp = timezone.now() - timedelta(weeks=2)
        post2.save()
        post3.timestamp = timezone.now() - timedelta(weeks=1)
        post3.save()

        # New
        response = self.client.get(reverse('explore-list') + '?time_range=all_time&ordering=new')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3) 
        self.assertEqual(response.data[0]['title'], "monkeys")
        self.assertEqual(response.data[1]['title'], "tacos")
        self.assertEqual(response.data[2]['title'], "rabbit")

        #Old
        response = self.client.get(reverse('explore-list') + '?time_range=all_time&ordering=old')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3) 
        self.assertEqual(response.data[0]['title'], "rabbit")
        self.assertEqual(response.data[1]['title'], "tacos")
        self.assertEqual(response.data[2]['title'], "monkeys")
    
    def test_sort_by_top_posts(self):
        user=self.user
        user2 = User.objects.create_user(username='test user 2', password='testpass')
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)
        hub.members.add(user2)

        # Create post with 2 likes.
        post1 = Post.objects.create(title="monkeys", message="monkeys", hub=hub, author=user)
        request = self.factory.put(f"posts/{post1.id}/like/")
        # Liked by user
        force_authenticate(request, user=user)
        view = LikePost.as_view()
        response = view(request, id=post1.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        self.assertEqual(post1.likes.count(), 1)
        # Liked by user2
        force_authenticate(request, user=user2)
        view = LikePost.as_view()
        response = view(request, id=post1.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK) #200 user could like/unlike
        self.assertEqual(post1.likes.count(), 2)

        # Create post with 1 like.
        post2 = Post.objects.create(title="rabbit", message="rabbit", hub=hub, author=user)
        request = self.factory.put(f"posts/{post2.id}/like/")
        # Liked by user
        force_authenticate(request, user=user)
        view = LikePost.as_view()
        response = view(request, id=post2.id)
        self.assertEqual(response.status_code, status.HTTP_200_OK) 
        self.assertEqual(post2.likes.count(), 1)

        # Create post with 0 likes.
        Post.objects.create(title="tacos", message="tacos", hub=hub, author=user)

        # Assert that there are three posts in order from oldest to newest
        response = self.client.get(reverse('explore-list') + '?time_range=all_time&ordering=top')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3) 
        self.assertEqual(response.data[0]['title'], "monkeys")
        self.assertEqual(response.data[1]['title'], "rabbit")
        self.assertEqual(response.data[2]['title'], "tacos")

    def test_sort_by_time_range(self):
        user=self.user
        hub = Hub.objects.create(name="TEST HUB", description="TEST HUB DESC", owner=user)

        # Create post that was made 400 days ago. Should appear in all time.
        post1 = Post.objects.create(title="monkeys", message="Monkeys", hub=hub, author=user)
        post1.timestamp = timezone.now() - timedelta(days=400)
        post1.save()
        
        # Create post that was made 350 days ago. Should appear in all time and year.
        post2 = Post.objects.create(title="rabbit", message="rabbit", hub=hub, author=user)
        post2.timestamp = timezone.now() - timedelta(days=350)
        post2.save()

        # Create post that was made 20 days ago. Should appear in all time, year, and month.
        post3 = Post.objects.create(title="tacos", message="tacos", hub=hub, author=user)
        post3.timestamp = timezone.now() - timedelta(days=20)
        post3.save()

        # Create post that was made 4 days ago. Should appear in all time, year, month, and week.
        post4 = Post.objects.create(title="cheese", message="cheese", hub=hub, author=user)
        post4.timestamp = timezone.now() - timedelta(days=4)
        post4.save()

        # Create post that was made 4 hours ago. Should appear in all time, year, month, week, and 24 hours.
        Post.objects.create(title="triangle", message="triangle", hub=hub, author=user)

        # All Time check (sorted by oldest)
        response = self.client.get(reverse('explore-list') + '?time_range=all_time&ordering=old')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 5) 
        self.assertEqual(response.data[0]['title'], "monkeys")
        self.assertEqual(response.data[1]['title'], "rabbit")
        self.assertEqual(response.data[2]['title'], "tacos")
        self.assertEqual(response.data[3]['title'], "cheese")
        self.assertEqual(response.data[4]['title'], "triangle")

        # Year check (sorted by oldest)
        response = self.client.get(reverse('explore-list') + '?time_range=year&ordering=old')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 4) 
        self.assertEqual(response.data[0]['title'], "rabbit")
        self.assertEqual(response.data[1]['title'], "tacos")
        self.assertEqual(response.data[2]['title'], "cheese")
        self.assertEqual(response.data[3]['title'], "triangle")

        # Month check (sorted by oldest)
        response = self.client.get(reverse('explore-list') + '?time_range=month&ordering=old')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 3) 
        self.assertEqual(response.data[0]['title'], "tacos")
        self.assertEqual(response.data[1]['title'], "cheese")
        self.assertEqual(response.data[2]['title'], "triangle")

        # Week check (sorted by oldest)
        response = self.client.get(reverse('explore-list') + '?time_range=week&ordering=old')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 2) 
        self.assertEqual(response.data[0]['title'], "cheese")
        self.assertEqual(response.data[1]['title'], "triangle")

        # 24 hour check (sorted by oldest)
        response = self.client.get(reverse('explore-list') + '?time_range=24_hours&ordering=old')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data), 1) 
        self.assertEqual(response.data[0]['title'], "triangle")
