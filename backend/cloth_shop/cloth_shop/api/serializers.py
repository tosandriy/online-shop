from rest_framework import serializers

from ..models import Product, Brand


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
    logo = serializers.SerializerMethodField('get_brand_logo')

    class Meta:
        model = Brand
        fields = ('logo','name')

    def get_brand_logo(self, obj):
        return obj.logo.url
