from django.utils import timezone
from datetime import timedelta
from rest_framework import generics, filters
from .models import Post
from django.db.models import Count

def filter_queryset(self, queryset):
    # Gets time_range parameter from api call. If none, then default is a week
    time_range = self.request.query_params.get('time_range', 'none')
    time_range_allowed = ['24_hours', 'week', 'month', 'year', 'all_time']
    if time_range == 'none':
        pass
    # If invalid time_range is given, set time_range to a week
    elif time_range not in time_range_allowed:
        time_range = 'week'
    elif time_range == '24_hours':
        start_date = timezone.now() - timedelta(hours=24)
    elif time_range == 'week':
        start_date = timezone.now() - timedelta(weeks=1)
    elif time_range == 'month':
        start_date = timezone.now() - timedelta(days=30)
    elif time_range == 'year':
        start_date = timezone.now() - timedelta(days=365)
    # If time_range is all_time, then the list of posts is not filtered at all. Otherwise, filter it.
    if time_range != 'all_time' and time_range != 'none':
        queryset = queryset.filter(timestamp__gte=start_date)

    ordering = self.request.query_params.get('ordering', 'none')
    orderings_allowed = ['bottom', 'top', 'old', 'new', 'random']
    if ordering == 'none':
        pass
    # If invalid ordering is given, set ordering to top
    elif ordering not in orderings_allowed:
        ordering = 'top'
    if ordering == 'bottom':
        queryset = queryset.annotate(number_of_likes=Count('likes')).order_by('number_of_likes')  
    elif ordering == 'top':
        queryset = queryset.annotate(number_of_likes=Count('likes')).order_by('-number_of_likes')
    elif ordering == 'random': 
        queryset = queryset.order_by('?')
    elif ordering == 'old':
        queryset = queryset.order_by('timestamp')
    elif ordering == 'new':
        queryset = queryset.order_by('-timestamp')
    return queryset

#def calculate_hot_score(self, queryset):
