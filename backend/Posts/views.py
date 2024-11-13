from django.shortcuts import render
from rest_framework import generics, status, filters
from .models import Post
from .serializers import PostSerializer, PostCreateSerializer, LikePostSerializer, DislikePostSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from django.shortcuts import get_object_or_404
from rest_framework.response import Response
from rest_framework.exceptions import PermissionDenied, NotFound
from django_filters.rest_framework import DjangoFilterBackend
from django.db.models import Q, Count
from django.utils import timezone
from datetime import timedelta
# Create your views here

# Able to create and view the post, should only handles POST requests to create a post
class CreatePost(generics.CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostCreateSerializer
    
        
# Delete the post by its ID
class PostDelete(generics.DestroyAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]
    lookup_field = "id"
    def perform_destroy(self, instance):
        user = self.request.user
        if user != instance.author:
            if user != instance.hub.owner:
                if user not in instance.hub.mods.all():
                    raise PermissionDenied("Could Not Delete Post: You are not post author, hub owner, or a hub moderator")
        instance.delete()



# Able to view a list of all post, should only handles GET requests to Fetch a list of all post 
class PostList(generics.ListAPIView): 
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    def get_queryset(self):
        user = self.request.user
        return Post.objects.filter(hub__in=user.joined_hubs.all())

    

# Get the post by its ID or return a 404 error if not found
class LikePost(generics.UpdateAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = LikePostSerializer
    lookup_field = "id"

# Get the post by its ID or return a 404 error if not found
class DislikePost(generics.UpdateAPIView):
    queryset = Post.objects.all()
    permission_classes = [IsAuthenticated]
    serializer_class = DislikePostSerializer
    lookup_field = "id"

# GET a single post by its ID
class PostDetail(generics.RetrieveAPIView):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]
    lookup_field = "id"

    def get_queryset(self):
        user = self.request.user
        if user.is_authenticated:
            qs = Post.objects.all()
        else:
            qs = Post.objects.filter(hub__private_hub=False)
        if qs is None:
            raise NotFound("No Post with this ID was found")
        return qs

# GET a list of posts for the explore page.
# Explore page includes all posts from public hubs and posts from private hubs that the user has joined
# Can be filtered by timestamp (past 24 hours, week, month, year, or all time) 
# and ordered by likes (ascending or descending) or timestamp (new or old)
class ExploreList(generics.ListAPIView): 
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['timestamp']  
    ordering_fields = ['timestamp'] # Do not need to include likes since likes isn't directly used
    def get_queryset(self):
        user = self.request.user
        
        # Since likes is a ManyToMany field, we need to convert to a numerical value that is the number of likes
        queryset = Post.objects.filter(Q(hub__private_hub=False) | Q(hub__in=user.joined_hubs.all())).annotate(number_of_likes=Count('likes')) 
        # Gets time_range parameter from api call. If none, then default is a week
        time_range = self.request.query_params.get('time_range', 'week')
        time_range_allowed = ['24_hours', 'week', 'month', 'year', 'all_time']
        # If invalid time_range is given, set time_range to a week
        if time_range not in time_range_allowed:
            time_range = 'week'
        if time_range == '24_hours':
            start_date = timezone.now() - timedelta(hours=24)
        if time_range == 'week':
            start_date = timezone.now() - timedelta(weeks=1)
        elif time_range == 'month':
            start_date = timezone.now() - timedelta(days=30)
        elif time_range == 'year':
            start_date = timezone.now() - timedelta(days=365)
        # If time_range is all_time, then the list of posts is not filtered at all. Otherwise, filter it.
        if time_range != 'all_time':
            queryset = queryset.filter(timestamp__gte=start_date)

        ordering = self.request.query_params.get('ordering', '-number_of_likes')
        orderings_allowed = ['likes', '-likes', 'timestamp', '-timestamp', 'random']
        if ordering not in orderings_allowed:
            ordering = '-likes'
        if ordering == 'likes': # Need to change to number_of_likes since 'likes' and '-likes' are used in the url parameters
            queryset = queryset.order_by('number_of_likes')  
        elif ordering == '-likes':
            queryset = queryset.order_by('-number_of_likes')
        elif ordering == 'random': 
            queryset = queryset.order_by('?')
        else:
            queryset = queryset.order_by(ordering) # For timestamp and -timestamp
        return queryset
