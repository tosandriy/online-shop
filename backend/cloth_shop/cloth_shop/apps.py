from django.apps import AppConfig


class ClothShopConfig(AppConfig) :
    name = 'cloth_shop'

    def ready(self):
        import cloth_shop.signals