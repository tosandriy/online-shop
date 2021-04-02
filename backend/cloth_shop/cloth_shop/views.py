from django.contrib.auth import authenticate, login, views as auth_views
from django.contrib.auth.decorators import login_required
from django.db.models import F, Q
from django.http import Http404
from django.shortcuts import render, redirect

from rest_framework import authentication, permissions
from rest_framework.views import APIView
from rest_framework.response import Response

import uuid
from yookassa import Configuration, Payment

from . import models
from . import choices
from . import forms
from . import settings


class MyLoginView(auth_views.LoginView):
    redirect_authenticated_user = True
    form_class = forms.UserLogInForm


def handle_login(request):
    login_form = forms.UserLogInForm(data=request.POST)

    if login_form.is_valid():
        email = request.POST['username']
        password = request.POST['password']
        user = authenticate(request=request, email=email, password=password)

        if user is not None:

            if user.is_active:
                login(request, user)

                if request.POST.get('remember_me', None):
                    request.session.set_expiry(settings.SESSION_COOKIE_AGE)

    return login_form


def main_page_view(request):
    newest_products = models.Product.objects.order_by('release')
    if len(newest_products) > 3:
        newest_products = newest_products[:4]

    popular_products = models.Product.objects.order_by('sold')
    if len(popular_products) > 3:
        popular_products = popular_products[:4]

    if request.POST:
        login_form = handle_login(request)

    else:
        login_form = forms.UserLogInForm()

    context = {
        "newest_products": newest_products,
        "popular_products": popular_products,
        "form": login_form,
    }

    return render(request,"main_page.html", context)


def product_view(request, id):
    product = models.Product.objects.get(pk=id)
    brand = product.brand.get().name
    sizes = product.get_able_sizes()

    if request.POST:
        login_form = handle_login(request)
    else:
        login_form = forms.UserLogInForm()

    context = {
        "product": product,
        "brand": brand,
        "sizes": sizes,
        "form": login_form,
    }

    return render(request, "product.html", context)


def filter_view(request,product_type):
    product_types = (x[0] for x in choices.TYPES)

    if product_type in product_types:
        products = models.Product.objects.order_by('release')

        if product_type != 'all':
            products = products.filter(cloth_type=product_type)
        brands = models.Brand.objects.all()

    else:
        raise Http404

    if request.GET:

        if brands_list := request.GET.getlist('brand', None):
            queries = [Q(brand__name=brand) for brand in brands_list]
            query = queries.pop()
            for item in queries:
                query |= item
            products = products.filter(query)

        if seasons := request.GET.getlist('season', None):
            if not "1" in seasons:
                queries = [Q(season=season) for season in seasons]
                query = queries.pop()
                for item in queries:
                    query |= item
                products = products.filter(query)

        if sizes := request.GET.getlist('size', None):
            all_sizes = ('XS', 'S', 'M', 'L', 'XL', 'XXL')
            queries = [Q(**{'amount_{}__gt'.format(size): 0}) for size in sizes if size in all_sizes]
            query = queries.pop()
            for item in queries:
                query |= item
            products = products.filter(query)

        from_ = request.GET.get('from', None)
        to = request.GET.get('to', None)

        if from_:
            products = products.filter(price__gte=int(from_))

        if to:
            products = products.filter(price__lte=int(to))

    if request.POST:
        login_form = handle_login(request)

    else:
        login_form = forms.UserLogInForm()

    context = {
            'products': products,
            'brands': brands,
            'form': login_form
    }

    return render(request,"products.html",context)


@login_required
def profile_view(request):
    return render(request,"profile.html")


@login_required
def purchase_history_view(request):
    return render(request,"purchase_history.html")


def register_view(request, *args, **kwargs):

    if not request.user.is_anonymous:
        return redirect("index")

    if request.POST:
        form = forms.UserRegisterForm(request.POST)

        if form.is_valid():
            form.save()
            return redirect("main")

    else:
        form = forms.UserRegisterForm()

    context = {
        'form': form,
    }
    return render(request, 'register.html', context=context)


@login_required
def cart_view(request):
    user = request.user
    cart_items = models.Cart.objects.prefetch_related('items').get(owner=user).items.all().prefetch_related('product')
    context = {
        'cart_items': cart_items,
    }

    return render(request,'cart.html', context=context)


@login_required
def before_payment_for_order_view(request):
    user = request.user
    user_cart = user.cart
    user_cart_price = user_cart.get_cart_price()

    payment = Payment.create({
        "amount": {
            "value": str(user_cart_price),
            "currency": "RUB"
        },
        "confirmation": {
            "type": "redirect",
            "return_url": "http://127.0.0.1:8000"
        },
        "capture": True,
        "description": "Заказ №1"
    }, uuid.uuid4())

    order = models.Order(status='waiting_for_capture',owner=request.user,items=user_cart.items)
    order.save()

    return redirect(payment.confirmation.confirmation_url)


# API
class AddToCartAPIView(APIView):
    """Adds product in user's cart"""
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None, *args, **kwargs):
        product_id = self.kwargs.get('product_id')
        size = self.kwargs.get('size')
        amount = self.kwargs.get('amount')
        product = models.Product.objects.get(pk=int(product_id))
        if product:
            item, created = models.Item.objects.get_or_create(product=product, amount=amount, size=size)
            user = request.user
            if not item in user.cart.items.all():
                user.cart.items.add(item)
                return Response({"added":True})
        return Response({"added": False})


class AfterPaymentForOrderAPIView(APIView):
    """creates an order after successful payment"""
    authentication_classes = (authentication.SessionAuthentication,)
    permission_classes = (permissions.IsAuthenticated,)

    def post(self, request, format=None, *args, **kwargs):
        payment_id = request['object']['id']
        Payment.capture(payment_id)

        order = models.Order.objects.get(payment_id=payment_id)
        order.status = 'succeeded'
        order.save()