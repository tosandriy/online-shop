from rest_framework import permissions, authentication
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response

from ..models import Product, Brand, MyUser, Cart, Item
from .serializers import ProductBriefSerializer, ProductSerializer, BrandSerializer

from .. import choices

from django.db.models import Q
from django.shortcuts import get_object_or_404


class ProductListView(ListAPIView):
    serializer_class = ProductBriefSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        order = self.kwargs.get('order', None)
        product_type = self.request.GET.get("product_type", "all")
        products = Product.objects.all()
        print(product_type)
        if product_type in (x[0] for x in choices.TYPES) and product_type != "all":
            products = products.filter(cloth_type=product_type)
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


class EmailAPIView(APIView):
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None, *args, **kwargs):
        email = request.query_params['email']
        return Response({"isEmailUnique": False if MyUser.objects.filter(email__iexact=email.lower()).exists() else True})


class CartAPIView(APIView):
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None, *args, **kwargs):
        cart = Cart.objects.get_or_create(user=request.user)
        items = []
        for item in cart.items.select_related("product"):
            items.append({
                "product_id": item.product.id,
                "product_name": item.product.name,

            })
        return Response({

        })

