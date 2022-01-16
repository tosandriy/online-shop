from rest_framework import serializers
from loguru import logger
from ..models import Product, Brand, Item, Cart


class ProductBriefSerializer(serializers.ModelSerializer):
    brand = serializers.SerializerMethodField('get_brand_url')
    main_photo = serializers.SerializerMethodField('get_main_photo_url')

    class Meta:
        model = Product
        fields = ('pk', 'name', 'price', 'brand', 'main_photo', 'sold')

    def get_brand_url(self, obj):
        return obj.brand.get().logo.url

    def get_main_photo_url(self,obj):
        return obj.main_photo.url


class ProductSerializer(serializers.ModelSerializer):
    brand_url = serializers.SerializerMethodField('get_brand_url')
    brand = serializers.SerializerMethodField('get_brand_name')
    main_photo = serializers.SerializerMethodField('get_main_photo_url')
    sizes = serializers.SerializerMethodField('get_sizes')
    season = serializers.SerializerMethodField('get_season')

    class Meta:
        model = Product
        fields = ('pk', 'name', 'price', 'brand', 'main_photo', 'brand_url', 'season', 'sizes')

    def get_brand_url(self, obj):
        return obj.brand.get().logo.url

    def get_brand_name(self, obj):
        return obj.brand.get().name

    def get_sizes(self, obj):
        return (size.split("_")[1] for size in obj.get_able_sizes())

    def get_main_photo_url(self, obj):
        return obj.main_photo.url

    def get_season(self, obj):
        return obj.get_season_display()


class BrandSerializer(serializers.ModelSerializer):
    brand_logo = serializers.SerializerMethodField('get_brand_logo')

    class Meta:
        model = Brand
        fields = ('brand_logo', 'name')

    def get_brand_logo(self, obj):
        logger.info(obj)
        logger.info(obj.__dict__)
        return obj.logo.url


class ItemProductSerializer(serializers.ModelSerializer):
    brand = BrandSerializer(many=True)

    class Meta:
        model = Product
        fields = ('id', 'name', 'price', 'main_photo', 'brand')


class ItemSerializer(serializers.ModelSerializer):
    product = ItemProductSerializer()
    price = serializers.SerializerMethodField('get_price')

    def get_price(self, obj):
        return obj.amount * obj.product.price


    class Meta:
        model = Item
        fields = ('product', 'size', 'amount', 'id', 'price')


class CartSerializer(serializers.ModelSerializer):
    items = ItemSerializer(many=True)
    cart_price = serializers.SerializerMethodField('get_cart_price')
    count = serializers.SerializerMethodField('get_items_amount')
    delivery_price = serializers.SerializerMethodField('get_delivery_price')

    def get_cart_price(self, obj):
        return obj.get_cart_price()

    def get_delivery_price(self, obj):
        cart_price = obj.get_cart_price()
        return 0 if cart_price > 2000 else 500

    def get_items_amount(self, obj):
        return obj.get_items_amount()

    class Meta:
        model = Cart
        fields = ('items', 'count', 'cart_price', 'id', 'status', 'delivery_price')
