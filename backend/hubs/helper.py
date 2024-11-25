from Tags.models import Hub_Tag
from django.db.models import Count

def filter_hub_tag_queryset(self, queryset):

    queryset = queryset.prefetch_related('hub_tag')
    tags = self.request.query_params.get('tags', 'none')
    if tags != 'none':
        tags_list = tags.split(',')
        tags_allowed = Hub_Tag.objects.values_list('name', flat=True)
        # If invalid tag is given, it is not used in the filter
        tags_list = [tag for tag in tags_list if tag in tags_allowed]
        if tags_list:
            queryset = queryset.filter(hub_tag__name__in=tags_list)  
        else:
            queryset = queryset.none()  

    ordering = self.request.query_params.get('ordering', 'none')
    orderings_allowed = ['bottom', 'top', 'old', 'new', 'random', 'a-z', 'z-a', 'none']
    # If invalid ordering is given, set ordering to top
    if ordering not in orderings_allowed:
        ordering = 'top'
    if ordering == 'none':
        pass
    elif ordering == 'top':
        queryset = queryset.annotate(number_of_members=Count('members')).order_by('-number_of_members')
    elif ordering == 'bottom':
        queryset = queryset.annotate(number_of_members=Count('members')).order_by('number_of_members')
    elif ordering == 'random': 
        queryset = queryset.order_by('?')
    elif ordering == 'old':
        queryset = queryset.order_by('created_at')
    elif ordering == 'new':
        queryset = queryset.order_by('-created_at')
    elif ordering == 'a-z':
        queryset = queryset.order_by('name')
    elif ordering == 'z-a':
        queryset = queryset.order_by('-name')
    return queryset

