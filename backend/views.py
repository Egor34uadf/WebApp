from rest_framework import viewsets, status, permissions
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from django.db.models import Q
from .models import Post, Like, Favorite
from .serializers import PostSerializer, LikeSerializer, FavoriteSerializer
from .user_serializers import UserSerializer

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Post.objects.all()

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)

    @action(detail=True, methods=['post'])
    def like(self, request, pk=None):
        post = self.get_object()
        like, created = Like.objects.get_or_create(user=request.user, post=post)
        if not created:
            like.delete()
            return Response({'status': 'unliked', 'likes_count': post.likes.count()})
        return Response({'status': 'liked', 'likes_count': post.likes.count()})

    @action(detail=True, methods=['post'])
    def favorite(self, request, pk=None):
        post = self.get_object()
        favorite, created = Favorite.objects.get_or_create(user=request.user, post=post)
        if not created:
            favorite.delete()
            return Response({'status': 'unfavorited'})
        return Response({'status': 'favorited'})


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]

    def get_permissions(self):
        if self.action in ['update', 'partial_update', 'destroy', 'me']:
            self.permission_classes = [permissions.IsAuthenticated]
        return super().get_permissions()

    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)


class FavoriteViewSet(viewsets.ModelViewSet):
    serializer_class = FavoriteSerializer
    permission_classes = [permissions.IsAuthenticated]
    http_method_names = ['get', 'delete']

    def get_queryset(self):
        queryset = Favorite.objects.filter(user=self.request.user)
        
        # Получаем параметр ordering из запроса
        ordering = self.request.query_params.get('ordering', '-created_date')
        
        # Поддерживаемые сортировки
        if ordering == 'title':
            queryset = queryset.order_by('post__title')
        elif ordering == '-title':
            queryset = queryset.order_by('-post__title')
        elif ordering == 'created_date':
            queryset = queryset.order_by('created_date')
        elif ordering == '-created_date':
            queryset = queryset.order_by('-created_date')
        else:
            queryset = queryset.order_by('-created_date')
            
        return queryset

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context