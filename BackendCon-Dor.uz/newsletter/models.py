"""Newsletter subscription model."""
from django.db import models


class NewsletterSubscriber(models.Model):
    email = models.EmailField("Email", unique=True, db_index=True)
    is_active = models.BooleanField("Faol", default=True)
    subscribed_at = models.DateTimeField("Obuna bo'lgan", auto_now_add=True)

    class Meta:
        verbose_name = "Obunachi"
        verbose_name_plural = "Obunachlar"
        ordering = ["-subscribed_at"]

    def __str__(self) -> str:
        return self.email
