from django.utils import timezone
from datetime import timedelta
from django.db.models import Count
from Tags.models import Post_Tag

def filter_queryset(self, queryset, current_hub=None):

    # Filter based on tags. If the current selected tags are X and Y, and post A has tag X, then it is included.
    tags = self.request.query_params.get('tags', 'none')
    # If tags parameter in URL field is not specified, then ignore filtering based on tags
    if tags != 'none':
        tags_list = tags.split(',')
        tags_allowed = Post_Tag.objects.filter(hub=current_hub).values_list('name', flat=True)

        # If invalid tag is given, it is not used in the filter
        for tag in tags_list[:]:
            if tag not in tags_allowed:
                tags_list.remove(tag)
        if tags_list:
            queryset = queryset.filter(tag__name__in=tags_list)  
        else:
            queryset = queryset.none()  

    # Gets time_range parameter from api call. If none, then default is a week
    time_range = self.request.query_params.get('time_range', 'none')
    time_range_allowed = ['24_hours', 'week', 'month', 'year', 'all_time', 'none']
    # If invalid time_range is given, set time_range to a week
    if time_range not in time_range_allowed:
        time_range = 'week'
    if time_range == 'none' or time_range == 'all_time':
        pass
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
    orderings_allowed = ['bottom', 'top', 'old', 'new', 'random', 'hot', 'none']
    # If invalid ordering is given, set ordering to top
    if ordering not in orderings_allowed:
        ordering = 'top'
    if ordering == 'none':
        pass
    elif ordering == 'bottom':
        queryset = queryset.annotate(number_of_likes=Count('likes')).order_by('number_of_likes')  
    elif ordering == 'top':
        queryset = queryset.annotate(number_of_likes=Count('likes')).order_by('-number_of_likes')
    elif ordering == 'random': 
        queryset = queryset.order_by('?')
    elif ordering == 'old':
        queryset = queryset.order_by('timestamp')
    elif ordering == 'new':
        queryset = queryset.order_by('-timestamp')
    elif ordering == 'hot':
        queryset = queryset.order_by('-hot_score')
    return queryset

