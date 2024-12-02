from django.shortcuts import get_object_or_404, render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, UserPublicInfoSerializer
from .serializers import UserSerializer, ResetPasswordSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.http import JsonResponse
from django.contrib.auth.forms import PasswordResetForm

# Create your views here.
class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = (AllowAny,)


class UserDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    def get_object(self):
        # Get access to current user
        user = self.request.user
        return user
@method_decorator(csrf_exempt, name='dispatch')
class CustomPasswordResetView(generics.CreateAPIView):
    permission_classes = (AllowAny,)
    serializer_class = ResetPasswordSerializer
    def post(self, request, *args, **kwargs):
        data = request.data
        form = PasswordResetForm(data)

        if form.is_valid():
            form.save(request=request)
            return JsonResponse({"message": "Password reset email sent!"}, status=200)
        return JsonResponse({"error": "Invalid data"}, status=400)

# api/users/<id>/info
class UserPublicInfoView(generics.RetrieveAPIView):
    serializer_class = UserPublicInfoSerializer
    permission_classes = [IsAuthenticated]
    lookup_field = "id"
    queryset = User.objects.all()
