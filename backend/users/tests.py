from django.test import TestCase
from rest_framework.test import APIRequestFactory, force_authenticate
from rest_framework import status
from users.views import CreateUserView, UserDetailView
from django.contrib.auth.models import User
import json
from django.urls import reverse
from rest_framework.test import APITestCase

class CustomPasswordResetViewTestCase(APITestCase):
    def setUp(self):
        self.password_reset_url = reverse('password_reset')
        self.user = User.objects.create_user(username="testuser",email="testuser@example.com",password="password")

    def test_password_reset_success(self):
        response = self.client.post(self.password_reset_url, {"email": self.user.email})
        response_data = json.loads(response.content)
        self.assertEqual(response.status_code, 200)
        self.assertIn("message", response_data)

    def test_password_reset_invalid_email(self):
        response = self.client.post(self.password_reset_url, {"email": "invalid@example.com"})
        response_data = json.loads(response.content)
        self.assertEqual(response.status_code, 200)  
        self.assertIn("message", response_data)

    def test_password_reset_missing_email(self):
        response = self.client.post(self.password_reset_url, {})
        response_data = json.loads(response.content)
        self.assertEqual(response.status_code, 400)
        self.assertIn("error", response_data)

# Create your tests here.
class UserTestCase(TestCase):
    def test_create_user(self):
        factory=APIRequestFactory()
        request=factory.post('/api/users/register/', {"email": "testemail@unlv.nevada.edu","username":"username", "password": "password"})
        view=CreateUserView.as_view()
        response=view(request)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
    def test_update_user(self):
        self.user = User.objects.create_user(username="username", email="testemail@unlv.nevada.edu",
                                             password="password")
        factory=APIRequestFactory()
        request=factory.patch('/api/users/currentUser/', {"username":"newusername"})
        force_authenticate(request, user=self.user)
        view=UserDetailView.as_view()
        response=view(request)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

