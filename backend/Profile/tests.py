from django.test import TestCase
from django.contrib.auth.models import User
from .models import Profile
from rest_framework.test import APITestCase

class UserProfileCreationTest(TestCase):
    def test_profile_creation_on_user_creation(self):
        user = User.objects.create_user(username='testuser', password='password')
        
        self.assertTrue(Profile.objects.filter(user=user).exists())
        
        profile = Profile.objects.get(user=user)
        self.assertEqual(profile.user, user)
        self.assertEqual(profile.name, 'testuser') 

class UserProfileFieldsTest(TestCase):
    def test_profile_fields(self):
        user = User.objects.create_user(username='testuser', password='password')
        
        profile = Profile.objects.get(user=user)

        self.assertEqual(profile.name, 'testuser')  
        self.assertEqual(profile.bio, None)  
        self.assertEqual(profile.pfp, 'defaultpfp.png')  

class UserProfileUpdateTest(TestCase):
    def test_profile_not_duplicated_on_user_update(self):
        user = User.objects.create_user(username='testuser', password='password')
        profile = Profile.objects.get(user=user)
        
        user.username = 'newusername'
        user.save()

        self.assertEqual(Profile.objects.filter(user=user).count(), 1)
        
        updated_profile = Profile.objects.get(user=user)
        self.assertEqual(updated_profile.user, user)
