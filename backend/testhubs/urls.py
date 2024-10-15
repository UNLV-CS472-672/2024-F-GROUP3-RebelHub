from django.urls import path
from .views import DummyHubList, CreateComment

urlpatterns = [
    path('api/dummyhubs/', DummyHubList.as_view(), name='dummy-hub-list'),
    path('posts/<int:post_id>/comments/', CreateComment.as_view(), name='comment-create'),

]
