from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth.models import User
from .models import Post
from .serializers import PostSerializer
from .user_serializers import UserSerializer

class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        # Авторизованный пользователь видит ВСЕ статьи (для админа/модерации)
        # Но можно оставить только свои - раскомментируй строку ниже
        # return Post.objects.filter(author=self.request.user)
        return Post.objects.all()

    def perform_create(self, serializer):
        # Автор автоматически берется из запроса
        serializer.save(author=self.request.user)

    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Проверяем, что автор статьи - текущий пользователь
        if instance.author != request.user:
            return Response(
                {'error': 'Вы не можете редактировать чужую статью'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        self.perform_update(serializer)
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        
        # Проверяем, что автор статьи - текущий пользователь
        if instance.author != request.user:
            return Response(
                {'error': 'Вы не можете удалить чужую статью'},
                status=status.HTTP_403_FORBIDDEN
            )
        
        self.perform_destroy(instance)
        return Response(status=status.HTTP_204_NO_CONTENT)


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]  # Регистрация доступна всем

    def get_permissions(self):
        # Для удаления/обновления нужна авторизация
        if self.action in ['update', 'partial_update', 'destroy']:
            self.permission_classes = [IsAuthenticated]
        return super().get_permissions()

    def update(self, request, *args, **kwargs):
        user = self.get_object()
        if user != request.user:
            return Response(
                {'error': 'Вы можете редактировать только свой профиль'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        user = self.get_object()
        if user != request.user:
            return Response(
                {'error': 'Вы можете удалить только свой профиль'},
                status=status.HTTP_403_FORBIDDEN
            )
        return super().destroy(request, *args, **kwargs)