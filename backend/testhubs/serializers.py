from rest_framework import serializers
from .models import DummyHub

class DummyHubSerializer(serializers.ModelSerializer):
    class Meta:
        model = DummyHub
        fields = '__all__'