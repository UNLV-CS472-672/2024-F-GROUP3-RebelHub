from django.urls import path
from .views import AddPictureToPostView, DeletePictureInPostView, UserPicturesView, EditPictureInPostView

urlpatterns = [
    path('pictures/<int:post_id>/', AddPictureToPostView.as_view(), name='upload_picture'),
    path('pictures/<str:username>/', UserPicturesView.as_view(), name='get_user_pictures'),
    path('pictures/<int:id>/edit/', EditPictureInPostView.as_view(), name='edit_post_picture'),
    path('pictures/<int:id>/delete/', DeletePictureInPostView.as_view(), name='delete_post_picture'),
]
