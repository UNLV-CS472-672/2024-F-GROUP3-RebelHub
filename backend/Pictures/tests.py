from django.test import TestCase, override_settings
from django.urls import reverse
from .models import user_directory_path
from .models import Post
from .views import *
from hubs.models import Hub
from django.contrib.auth.models import User
from django.conf import settings
from rest_framework.test import APIClient, force_authenticate
import os
import tempfile
from PIL import Image

# Create your tests here.

class PostPictureTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user)

        self.hub = Hub.objects.create(name='hub', description='hub', owner=self.user)
        self.post = Post.objects.create(author=self.user, title="t", message="m", hub_id=self.hub.id)
        self.image = Image.new('RGB', (1,1))
    
    def test_add_picture_to_post(self):
        """
        Test if a picture can be made with a post.
        """
        # Create a temporary directory that will act as the media root and will automatically delete after the context is left
        with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as temp_dir:
            # Create a context manager where the media root is the temporary directory
            with override_settings(MEDIA_ROOT=temp_dir):
                # Create a temporary file to upload to the directory
                with tempfile.NamedTemporaryFile(suffix='.png') as temp_file:
                    self.image.save(temp_file, 'PNG')
                    temp_file.seek(0)
                    temp_file_name = os.path.basename(temp_file.name)

                    form_data = {'image': temp_file}

                    response = self.client.post(reverse('upload_picture', kwargs={'post_id': self.post.id}), form_data)

                    self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Picture object was not created.")

                    pic = Picture.objects.get(pk=response.data['id'])

                    # Check that the picture's image link is the same as the image
                    self.assertTrue(temp_file_name in str(pic.image), "Image was not linked to picture object.")
                    # Make sure image exists in the media folder
                    self.assertTrue(os.path.exists(os.path.join(settings.MEDIA_ROOT, user_directory_path(pic, temp_file_name))), "Image does not exist in media folder.")
    
    def test_edit_picture_in_post(self):
        """
        Test if a picture in a post can be changed.
        """
        # Create a temporary directory that will act as the media root and will automatically delete after the context is left
        with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as temp_dir:
            # Create a context manager where the media root is the temporary directory
            with override_settings(MEDIA_ROOT=temp_dir):
                # Create a temporary file to upload to the directory
                with tempfile.NamedTemporaryFile(suffix='.png') as temp_file:
                    self.image.save(temp_file, 'PNG')
                    temp_file.seek(0)
                    temp_file_name = os.path.basename(temp_file.name)

                    form_data = {'image': temp_file}

                    response = self.client.post(reverse('upload_picture', kwargs={'post_id': self.post.id}), form_data)

                    self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Picture creation failed.")

                    pic = Picture.objects.get(pk=response.data['id'])

                    # Check that the picture's image link is the same as the image
                    self.assertTrue(temp_file_name in str(pic.image), "Image was not linked to picture object.")
                    # Make sure image exists in the media folder
                    self.assertTrue(os.path.exists(os.path.join(settings.MEDIA_ROOT, user_directory_path(pic, temp_file_name))), "Image does not exist in media folder.")

                    with tempfile.NamedTemporaryFile(suffix='.png') as replace_temp_file:
                        self.image.save(replace_temp_file, 'PNG')
                        replace_temp_file.seek(0)
                        replace_temp_file_name = os.path.basename(replace_temp_file.name)

                        replace_form_data = {'image': replace_temp_file}

                        response = self.client.patch(reverse('edit_post_picture', kwargs={'id': pic.id}), replace_form_data)

                        self.assertEqual(response.status_code, status.HTTP_200_OK, "Picture edit failed.")

                        # Since the id doesn't change, we can reuse the first picture's id
                        new_pic = Picture.objects.get(pk=pic.id)

                        # Make sure image was changed
                        self.assertNotEqual(pic.image, new_pic.image, "Image was not changed.")

                        # Check that the picture's image link is the same as the new image
                        self.assertTrue(replace_temp_file_name in str(new_pic.image), "Image was not linked to picture object.")
                        # Check that the picture's image link is not the same as the old image
                        self.assertFalse(temp_file_name in str(new_pic.image), "Picture object is linked to old image.")

                        # Make sure new image exists in the media folder
                        self.assertTrue(os.path.exists(os.path.join(settings.MEDIA_ROOT, user_directory_path(new_pic, replace_temp_file_name))), "Image does not exist in media folder.")
                        # Make sure old image doesn't exist in the media folder
                        self.assertFalse(os.path.exists(os.path.join(settings.MEDIA_ROOT, user_directory_path(new_pic, temp_file_name))), "Image in media folder was not deleted.")
    
    def test_delete_picture_in_post(self):
        """
        Test if an picture can be deleted without deleting the post.
        """
        with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as temp_dir:
            with override_settings(MEDIA_ROOT=temp_dir):
                with tempfile.NamedTemporaryFile(suffix='.png') as temp_file:
                    self.image.save(temp_file, 'PNG')
                    temp_file.seek(0)
                    temp_file_name = os.path.basename(temp_file.name)

                    form_data = {'image': temp_file}

                    response = self.client.post(reverse('upload_picture', kwargs={'post_id': self.post.id}), form_data)

                    self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Picture creation failed.")

                    pic = Picture.objects.get(pk=response.data['id'])

                    # Check that the picture's image link is the same as the image
                    self.assertTrue(temp_file_name in str(pic.image), "Image was not linked to picture object.")
                    # Make sure image exists in the media folder
                    self.assertTrue(os.path.exists(os.path.join(settings.MEDIA_ROOT, user_directory_path(pic, temp_file_name))), "Image does not exist in media folder.")

                    response = self.client.delete(reverse('delete_post_picture', kwargs={'id': pic.id}))

                    self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT, "Delete request failed.")

                    # Check that the object was deleted in the backend
                    self.assertEqual(Picture.objects.count(), 0, "Picture object in backend was not deleted.")
                    # Make sure image does not exist in the media folder
                    self.assertFalse(os.path.exists(os.path.join(settings.MEDIA_ROOT, user_directory_path(pic, temp_file_name))), "Image in media folder was not deleted.")

    def test_get_pictures_from_post(self):
        """
        Test if the post serializer properly returns the link to an image.
        """
        with tempfile.TemporaryDirectory(ignore_cleanup_errors=True) as temp_dir:
            with override_settings(MEDIA_ROOT=temp_dir):
                with tempfile.NamedTemporaryFile(suffix='.png') as temp_file:
                    self.image.save(temp_file, 'PNG')
                    temp_file.seek(0)
                    temp_file_name = os.path.basename(temp_file.name)

                    form_data = {'image': temp_file}

                    response = self.client.post(reverse('upload_picture', kwargs={'post_id': self.post.id}), form_data)

                    self.assertEqual(response.status_code, status.HTTP_201_CREATED, "Picture creation failed.")

                    pic = Picture.objects.get(pk=response.data['id'])

                    # Check that the picture's image link is the same as the image
                    self.assertTrue(temp_file_name in str(pic.image), "Image was not linked to picture object.")
                    # Make sure image exists in the media folder
                    self.assertTrue(os.path.exists(os.path.join(settings.MEDIA_ROOT, user_directory_path(pic, temp_file_name))), "Image does not exist in media folder.")

                    response = self.client.get(reverse('post-detail', kwargs={'id': self.post.id}))

                    self.assertEqual(response.status_code, status.HTTP_200_OK, "Could not get post.")

                    pictures_response = response.data['pictures'][0]

                    # Make sure the id of the picture and the post serializer's returned pijcture id are the same
                    self.assertEqual(pic.id, pictures_response[0], "Picture id is not the same.")
                    # Check that the link given from the serializer leads to the image from the picture
                    self.assertTrue(str(pic.image) in pictures_response[1])
