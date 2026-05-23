from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    author = serializers.StringRelatedField(read_only=True)  # покажет имя, а не id

    class Meta:
        model = Post
        fields = ['id', 'title', 'content', 'author', 'created_date', 'updated_date']
        read_only_fields = ['author', 'created_date', 'updated_date']  # эти поля заполняются автоматически