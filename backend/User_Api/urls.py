
from django.urls import include, path
from User_Api.views import CreateUserView
urlpatterns = [
    path('User_Api/register/',CreateUserView.as_view(),name='register'),
]