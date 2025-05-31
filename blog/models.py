from django.db import models

# Create your models here.
class Post(models.Model):
    title = models.CharField(max_length=100)
    content = models.TextField()
    image = models.URLField(max_length=300, blank=True, null=True)
    date_added = models.DateTimeField(auto_now_add = True)

    def __str__ (self):
        return self.title

class Comment(models.Model):
    post = models.ForeignKey(Post, related_name = 'comments', on_delete = models.CASCADE)
    author = models.CharField(max_length = 50)
    text = models.TextField()
    created = models.DateTimeField(auto_now_add = True)

    def __str__(self):
        return f'Commented by: {self.author}'

