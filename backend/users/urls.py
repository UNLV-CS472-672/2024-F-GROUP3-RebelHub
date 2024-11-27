
from django.urls import include, path
from users.views import CreateUserView, UserDetailView, UserPublicInfoView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [
    path('users/register/',CreateUserView.as_view(),name='register'),
    path('users/token/',TokenObtainPairView.as_view(),name='get_token'),
    path('users/token/refresh/',TokenRefreshView.as_view(),name='refresh'),
    path('users/currentUser/', UserDetailView.as_view(), name='user-detail'),
    path('users/<id>/info/', UserPublicInfoView.as_view(), name='users-info'),
]
