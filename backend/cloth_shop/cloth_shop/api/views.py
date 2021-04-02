from rest_framework import permissions, authentication
from rest_framework.generics import ListAPIView, RetrieveAPIView

from ..models import Product, Brand
from .serializers import ProductBriefSerializer, ProductSerializer, BrandSerializer

from django.db.models import Q
from django.shortcuts import get_object_or_404


class ProductListView(ListAPIView):
    serializer_class = ProductBriefSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        products = Product.objects.all()
        order = self.kwargs.get('order', None)
        if order == 'up':
            products = products.order_by('price')
        elif order == 'down':
            products = products.order_by('-price')
        elif order == 'popular':
            products = products.order_by('sold')
        return products


class ProductDetailView(RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = (permissions.AllowAny,)


class BrandsListView(ListAPIView):
    queryset = Brand.objects.all()
    serializer_class = BrandSerializer
    permission_classes = (permissions.AllowAny,)


class ProductsFilterAPIView(ListAPIView):
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.AllowAny,)
    serializer_class = ProductSerializer

    def get_queryset(self):
        brand_name = self.request.GET.get('brand',None)
        season = self.request.GET.get('season', None)
        sizes = self.request.GET.get('size', None)
        from_ = self.request.GET.get('from', None)
        to = self.request.GET.get('to', None)
        order = self.request.GET.get('order', None)
        products = Product.objects.all()

        if brand_name:
            brand = get_object_or_404(Brand, name=brand_name)
            products = products.filter(brand=brand)

        if season:
            if not "1" in season:
                queries = [Q(season=season) for season in season]
                query = queries.pop()
                for item in queries:
                    query |= item
                products = products.filter(query)

        if sizes:
            all_sizes = ('XS', 'S', 'M', 'L', 'XL', 'XXL')
            queries = [Q(**{'amount_{}__gt'.format(size): 0}) for size in sizes if size in all_sizes]
            query = queries.pop()
            for item in queries:
                query |= item
            products = products.filter(query)

        if from_:
            products = products.filter(price_gte=from_)

        if to:
            products = products.filter(price_lte=to)
        if order == 'up':
            products = products.order_by('price')
        elif order == 'down':
            products = products.order_by('-price')
        elif order == 'popular':
            products = products.order_by('sold')
        return products

