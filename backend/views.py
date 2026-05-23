from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Post
from .serializers import PostSerializer

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]   # только для авторизованных

    def get_queryset(self):
        # Каждый видит только свои статьи
        return Post.objects.filter(author=self.request.user)