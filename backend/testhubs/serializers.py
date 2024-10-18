from rest_framework import serializers
from .models import DummyHub
from .models import Comment
from .models import Post

class DummyHubSerializer(serializers.ModelSerializer):
    class Meta:
        model = DummyHub
        fields = '__all__'