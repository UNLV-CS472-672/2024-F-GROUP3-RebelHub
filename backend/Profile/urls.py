from django.urls import path
from .views import ProfileView, OtherProfileView


urlpatterns = [
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/<str:username>/', OtherProfileView.as_view(), name='profile'),
]