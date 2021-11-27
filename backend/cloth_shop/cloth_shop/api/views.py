from rest_framework import permissions, authentication, status
from rest_framework.generics import ListAPIView, RetrieveAPIView
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.viewsets import ViewSet

from ..models import *
from .serializers import *

from .. import choices

from django.db.models import Q
from django.shortcuts import get_object_or_404

from django.core.exceptions import ObjectDoesNotExist

from loguru import logger


class ProductListView(ListAPIView):
    serializer_class = ProductBriefSerializer
    permission_classes = (permissions.AllowAny,)

    def get_queryset(self):
        order = self.kwargs.get('order', None)
        product_type = self.request.GET.get("product_type", "all")
        products = Product.objects.all()
        if product_type in (x[0] for x in choices.TYPES) and product_type != "all":
            logger.info("product_type: " + product_type)
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
    serializer_class = ProductSerializer

    @logger.catch
    def get_queryset(self):
        brand_names = self.request.GET.get('brand',None)
        seasons = self.request.GET.get('season', None)
        sizes = self.request.GET.get('size', None)
        from_ = self.request.GET.get('from', None)
        to = self.request.GET.get('to', None)
        order = self.request.GET.get('order', None)
        products = Product.objects.all()

        if brand_names:
            brand_names = brand_names.split(",")
            queries = [Q(brand=get_object_or_404(Brand, name=brand_name)) for brand_name in brand_names]
            query = queries.pop()
            for item in queries:
                query |= item
            products = products.filter(query)

        if seasons:
            seasons = seasons.split(",")
            if "1" not in seasons:
                queries = [Q(season=season) for season in seasons]
                query = queries.pop()
                for item in queries:
                    query |= item
                products = products.filter(query)

        if sizes:
            sizes = sizes.split(",")
            all_sizes = ('XS', 'S', 'M', 'L', 'XL', 'XXL')
            queries = [Q(**{'amount_{}__gt'.format(size): 0}) for size in sizes if size in all_sizes]
            query = queries.pop()
            for item in queries:
                query |= item
            products = products.filter(query)

        if from_:
            products = products.filter(price__gte=from_)

        if to:
            products = products.filter(price__lte=to)
        if order == 'up':
            products = products.order_by('price')
        elif order == 'down':
            products = products.order_by('-price')
        elif order == 'popular':
            products = products.order_by('sold')
        return products


class UserInfoAPIView(APIView):
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def get(self, request, format=None, *args, **kwargs):
        user = request.user
        response_object = {
            "first_name": None,
            "surname": None,
            "patronymic": None,
            "phone_number": None,
            "city": None,
            "region": None,
            "street": None,
            "building": None,
            "flat": None,
            "index": None
        }

        try:
            shipping_info_object = ShippingInfo.objects.get(user=user)
        except ObjectDoesNotExist:
            pass
        else:
            response_object["first_name"] = shipping_info_object.first_name
            response_object["surname"] = shipping_info_object.surname
            response_object["patronymic"] = shipping_info_object.patronymic
            response_object["phone_number"] = shipping_info_object.phone_number
            response_object["country"] = shipping_info_object.country
            response_object["city"] = shipping_info_object.city
            response_object["region"] = shipping_info_object.region
            response_object["street"] = shipping_info_object.street
            response_object["building"] = shipping_info_object.building
            response_object["flat"] = shipping_info_object.flat
            response_object["index"] = shipping_info_object.index

        return Response(response_object)

    @logger.catch
    def post(self, request, format=None, *args, **kwargs):
        user = request.user
        response_object = {}
        try:
            shipping_info_object = ShippingInfo.objects.get(user=user)
        except ObjectDoesNotExist:
            shipping_info_object = ShippingInfo.objects.create()
            shipping_info_object.save()
            user.shipping_info = shipping_info_object
            user.save()

        first_name = request.data.get("first_name")
        surname = request.data.get("surname")
        patronymic = request.data.get("patronymic")
        phone_number = request.data.get("phone_number")

        country = request.data.get("country")
        city = request.data.get("city")
        region = request.data.get("region")
        street = request.data.get("street")
        building = request.data.get("building")
        flat = request.data.get("flat")
        index = request.data.get("index")

        if first_name or surname or patronymic or phone_number \
                or country or city or region or street or building or flat:
            if first_name:
                shipping_info_object.first_name = first_name
            if surname:
                shipping_info_object.surname = surname
            if patronymic:
                shipping_info_object.patronymic = patronymic
            if phone_number:
                shipping_info_object.phone_number = phone_number
            if country:
                shipping_info_object.country = country
            if city:
                shipping_info_object.city = city
            if region:
                shipping_info_object.region = region
            if street:
                shipping_info_object.street = street
            if building:
                shipping_info_object.building = building
            if flat:
                shipping_info_object.flat = flat
            if index:
                shipping_info_object.index = index

            shipping_info_object.save()

        response_object["first_name"] = shipping_info_object.first_name
        response_object["surname"] = shipping_info_object.surname
        response_object["patronymic"] = shipping_info_object.patronymic
        response_object["phone_number"] = shipping_info_object.phone_number
        response_object["country"] = shipping_info_object.country
        response_object["city"] = shipping_info_object.city
        response_object["region"] = shipping_info_object.region
        response_object["street"] = shipping_info_object.street
        response_object["building"] = shipping_info_object.building
        response_object["flat"] = shipping_info_object.flat

        return Response(response_object)


class EmailAPIView(APIView):
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.AllowAny,)

    def get(self, request, format=None, *args, **kwargs):
        email = request.query_params.get("email")
        if email:
            is_email_unique = False if MyUser.objects.filter(email__iexact=email.lower()).exists() else True

        else:
            is_email_unique = False

        return Response({"isEmailUnique": is_email_unique})


class CartViewSet(ViewSet):
    """
    Used for operations with cart
    """
    authentication_classes = (authentication.TokenAuthentication,)
    permission_classes = (permissions.AllowAny,)

    @logger.catch
    def get_cart_by_hash(self, request,  *args, **kwargs):
        cart_hash = request.data.get("cart_hash")
        user = request.user
        cart = None

        if cart_hash:
            if user.is_anonymous:
                if cart_hash:
                    cart = Cart.objects.get(id=cart_hash)

            else:
                cart = Cart.objects.get(owner=user)

            if cart:
                cart_serializer = CartSerializer(cart)
                return Response(cart_serializer.data, status=status.HTTP_200_OK)
            return Response(status=status.HTTP_204_NO_CONTENT)
        return Response(status=status.HTTP_404_NOT_FOUND)

    @logger.catch
    def get_cart_by_hash_or_combine(self, request, *args, **kwargs):
        cart_hash = request.data.get("cart_hash")
        user = request.user
        cart = None
        logger.info(user.is_anonymous)
        if cart_hash:
            if user.is_anonymous:
                if cart_hash:
                    cart = Cart.objects.get(id=cart_hash)

            else:
                user_cart = Cart.objects.prefetch_related("items").get(owner=user)
                cart = Cart.objects.prefetch_related("items").get(id=cart_hash)
                logger.info(cart != user_cart)
                if cart != user_cart:
                    for cart_item in cart.items.all():
                        if user_cart_item := user_cart.items.filter(product_id=cart_item.product.id, size=cart_item.size):
                            user_cart_item = user_cart_item.first()
                            user_cart_item.amount = user_cart_item.amount + cart_item.amount
                            user_cart_item.save()
                        else:
                            new_cart_item = Item(
                                product=cart_item.product,
                                size=cart_item.size,
                                amount=cart_item.amount
                            )
                            new_cart_item.save()
                            user_cart.items.add(new_cart_item)
                    user_cart.save()
                    cart = user_cart

            if cart:
                cart_serializer = CartSerializer(cart)
                return Response(cart_serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_204_NO_CONTENT)

    @logger.catch
    def create_new_cart(self, request, *args, **kwargs):
        user = request.user
        created = False

        if user.is_anonymous:
            cart = Cart()
            cart.save()
            created = True
        else:
            cart = Cart.objects.get(owner=user)
            if not cart:
                cart = Cart()
                if not cart.owner:
                    cart.owner = user
                    cart.save()
                elif cart.owner != user:
                    return Response(status=status.HTTP_403_FORBIDDEN)

        if cart:
            serializer = CartSerializer(cart)
            if created:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)

    def update_cart_item(self, request, *args, **kwargs):
        cart_hash = request.data.get("cart_hash")
        item_hash = request.data.get("item_hash")
        product_size = request.data.get("product_size")
        product_amount = request.data.get("product_amount")

        user = request.user
        cart = get_object_or_404(Cart, id=cart_hash)

        if cart.owner and cart.owner != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        if cart_query := cart.items.filter(id=item_hash):
            cart_item = cart_query.get()
            if product_size:
                cart_item.size = product_size

            if product_amount:
                cart_item.amount = product_amount

            cart_item.save()

            item_serializer = ItemSerializer(cart_item)

            return Response(item_serializer.data, status=status.HTTP_200_OK)

        return Response(status=status.HTTP_404_NOT_FOUND)

    def add_cart_item(self, request):
        cart_hash = request.data.get("cart_hash")
        product_id = request.data.get("product_id")
        size = request.data.get("size")
        amount = request.data.get("amount")

        try:
            amount = int(amount)
        except ValueError as e:
            return Response(status=status.HTTP_400_BAD_REQUEST)

        user = request.user
        cart = get_object_or_404(Cart, id=cart_hash)

        if cart.owner and cart.owner != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        if existing_item := cart.items.filter(product_id=product_id, size=size).first():
            existing_item.amount = existing_item.amount + amount
            existing_item.save()

        else:
            item = Item(product_id=product_id, size=size, amount=amount)
            item.save()
            cart.items.add(item)
            cart.save()

        cart_serializer = CartSerializer(cart)

        return Response(cart_serializer.data, status=status.HTTP_200_OK)

    def remove_cart_item(self, request):
        cart_hash = request.data.get("cart_hash")
        item_hash = request.data.get("item_hash")

        user = request.user

        cart = get_object_or_404(Cart, id=cart_hash)

        if cart.owner and cart.owner != user:
            return Response(status=status.HTTP_403_FORBIDDEN)

        query = cart.items.filter(id=item_hash)

        if query.exists():
            item = query.get()
            cart.items.remove(item)
            item.delete()
            cart.save()

            cart_serializer = CartSerializer(cart)

            return Response(cart_serializer.data, status=status.HTTP_200_OK)
        return Response(status=status.HTTP_404_NOT_FOUND)
