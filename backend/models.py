from django.db import models
from django.contrib.auth.models import User

class Post(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField()
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    image = models.ImageField(upload_to='post_images/', null=True, blank=True)  # новое поле
    created_date = models.DateTimeField(auto_now_add=True)
    updated_date = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title


class Like(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='likes')
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # один пользователь — один лайк на статью

    def __str__(self):
        return f"{self.user.username} likes {self.post.title}"


class Favorite(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='favorited_by')
    created_date = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'post')  # один пользователь — одно избранное

    def __str__(self):
        return f"{self.user.username} favorited {self.post.title}"