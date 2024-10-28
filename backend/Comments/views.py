from rest_framework import generics
from rest_framework import status
from .models import Comment
from .serializers import CommentSerializer
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404


# Create your views here.

# Create a comment for the specific post
class CommentCreate(generics.CreateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

# Retrieve single comment based on ID
class CommentDetail(generics.RetrieveAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    lookup_field = 'id'

# Update an existing comment
class CommentUpdate(generics.UpdateAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer
    permission_classes = [IsAuthenticated]

# Delete a comment
class CommentDelete(generics.DestroyAPIView):
    queryset = Comment.objects.all()
    permission_classes = [IsAuthenticated]
    
# Using to timestamp to order the comments 
class CommentList(generics.ListAPIView):
    queryset = Comment.objects.all()
    serializer_class = CommentSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        order = self.request.query_params.get('order', 'timestamp')  

        # If wanting to order by likes
        if order == 'likes':
            return queryset.order('-likes', '-timestamp')  
        elif order == 'least_likes':
            return queryset.order('likes', 'timestamp') 
        else:
            return queryset.order('-timestamp') 

'''
# CommentView handles the comment requests for the post
class CreateComment(APIView):
    permission_classes = [IsAuthenticated]
     # A POST method to create a new comment for the post by getting the ID
    def post(self, request, post_id):
        try:
            post = Post.objects.get(pk=post_id)
            
            # Error message if post post doesn't exist
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND)
        
        # Use serializer with the request data
        serializer = CommentSerializer(data=request.data)
        
        # Check if data is valid
        if serializer.is_valid():  
            # Save the comment from the user under the post if data is valid
            serializer.save(author=request.user, post=post)  
            return Response(serializer.data, status=status.HTTP_201_CREATED)  
        # If the data is invalid, then return an error
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    # This GET method is to get all comments for the post
    def get(self, request, post_id):
        # First fetch the post by its ID
        try:
            post = Post.objects.get(pk=post_id)  
            
            # Error message if post doesn't exist
        except Post.DoesNotExist:
            return Response({'error': 'Post not found'}, status=status.HTTP_404_NOT_FOUND) 

        # Then get all comments related to this post
        comments = Comment.objects.filter(post=post)
        
        # Serialize the comment data and return to client
        serializer = CommentSerializer(comments, many=True)
        return Response(serializer.data)  
    
'''