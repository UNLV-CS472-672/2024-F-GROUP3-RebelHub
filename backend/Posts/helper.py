from django.utils import timezone
from datetime import timedelta
from .models import Post
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
    time_range_allowed = ['24 hours', 'week', 'month', 'year', 'all time', 'none']
    # If invalid time_range is given, set time_range to a week
    if time_range not in time_range_allowed:
        time_range = 'week'
    now = timezone.now()
    if time_range == 'none' or time_range == 'all time':
        pass
    elif time_range == '24 hours':
        start_date = now - timedelta(hours=24)
    elif time_range == 'week':
        start_date = now - timedelta(weeks=1)
    elif time_range == 'month':
        start_date = now - timedelta(days=30)
    elif time_range == 'year':
        start_date = now - timedelta(days=365)
    # If time_range is all time, then the list of posts is not filtered at all. Otherwise, filter it.
    if time_range != 'all time' and time_range != 'none':
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
        set_hot_score(queryset)
        queryset = queryset.order_by('-hot_score')
    return queryset

def set_hot_score(queryset):
 
    queryset = queryset.annotate(number_of_likes=Count('likes'))
    
    posts = list(queryset)
    
    for post in posts:
        post.hot_score = calculate_hot_score(post.number_of_likes, post.comments, post.timestamp)
    
    Post.objects.bulk_update(posts, ['hot_score'])

def calculate_hot_score(likes, comments, timestamp):
    likes_score = likes * calculate_time_factor(timestamp)
    
    comments_score = sum(calculate_time_factor(comment.timestamp) for comment in comments.all())
    
    return likes_score + comments_score


def calculate_time_factor(timestamp):
    now = timezone.now()
    
    if timestamp >= now - timedelta(hours=4):
        return 5  
    elif timestamp >= now - timedelta(hours=12):
        return 4.5  
    elif timestamp >= now - timedelta(hours=24):
        return 4  
    elif timestamp >= now - timedelta(days=3):
        return 3  
    elif timestamp >= now - timedelta(weeks=1):
        return 0.5  
    elif timestamp >= now - timedelta(weeks=2):
        return 0.1  # 
    elif timestamp >= now - timedelta(weeks=4):
        return 0.01  
    elif timestamp >= now - timedelta(weeks=8):
        return 0.0025  
    else:
        return 0.0001