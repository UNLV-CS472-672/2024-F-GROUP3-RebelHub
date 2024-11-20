
from django.urls import include, path
from users.views import CreateUserView, UserDetailView, CustomPasswordResetView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from django.contrib.auth import views as auth_views

urlpatterns = [
    path('users/register/',CreateUserView.as_view(),name='register'),
    path('users/token/',TokenObtainPairView.as_view(),name='get_token'),
    path('users/token/refresh/',TokenRefreshView.as_view(),name='refresh'),
    path('users/currentUser/', UserDetailView.as_view(), name='user-detail'),
    path('users/resetPassword',CustomPasswordResetView.as_view(),name='password_reset'),
    path('users/resetPassword/done',auth_views.PasswordResetDoneView.as_view(),name='password_reset_done'),
    path('users/resetPassword/confirm/<uidb64>/<token>',auth_views.PasswordResetConfirmView.as_view(template_name='password_reset_form.html'),name='password_reset_confirm'),
    path('users/resetPassword/complete',auth_views.PasswordResetCompleteView.as_view(template_name='password_reset_form_complete.html'),name='password_reset_complete'),




]
