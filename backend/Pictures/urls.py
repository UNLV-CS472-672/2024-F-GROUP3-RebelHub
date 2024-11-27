from django.urls import path
from .views import AddPictureToPostView, UserPicturesView

urlpatterns = [
    path('pictures/<int:post_id>/', AddPictureToPostView.as_view(), name='upload_picture'),
    path('pictures/<str:username>/', UserPicturesView.as_view(), name='get_user_pictures'),
]
