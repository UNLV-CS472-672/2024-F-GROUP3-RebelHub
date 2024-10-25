
from django.urls import include, path
from users.views import CreateUserView, UserDetailView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
urlpatterns = [
    path('api/users/register/',CreateUserView.as_view(),name='register'),
    path('api/users/token/',TokenObtainPairView.as_view(),name='get_token'),
    path('api/users/token/refresh/',TokenRefreshView.as_view(),name='refresh'),
    path('api/users/currentUser/', UserDetailView.as_view(), name='user-detail'),



]