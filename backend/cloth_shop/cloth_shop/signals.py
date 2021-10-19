from django.db.models.signals import post_save
from .models import MyUser, Cart


def create_catalog(sender, instance, created, **kwargs):
    if instance and created:
        cart = Cart(owner=instance)
        cart.save()


post_save.connect(create_catalog, sender=MyUser)