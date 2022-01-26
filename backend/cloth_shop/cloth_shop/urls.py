from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls import url
from django.conf.urls.static import static
from django.contrib.auth import views as auth_views

from . import views
from . import settings as project_settings

from .api import views as api_views


urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.main_page_view, name='main'),
    path('products/<product_type>', views.filter_view, name='products'),
    path('product/<id>', views.product_view, name='product'),
    path('profile', views.profile_view, name='profile'),
    path('register', views.register_view, name='register'),
    path('logout', auth_views.LogoutView.as_view(), name='logout'),
    path('login', views.MyLoginView.as_view(template_name='login.html'), name='login'),
    path('purchase_history', views.purchase_history_view, name='history'),
    path('cart', views.cart_view, name='cart'),

    # api
    url('rest-auth/', include('rest_auth.urls')),
    url('rest-auth/registration/', include('rest_auth.registration.urls')),

    url('api/email/', api_views.EmailAPIView.as_view()),
    url('api/user-info/', api_views.UserInfoAPIView.as_view()),

    path('api/buy', views.before_payment_for_order_view, name='buy'),
    path('api/cart', api_views.CartViewSet.as_view({"get": "get_cart_by_hash", "post": "create_new_cart"})),
    path('api/cart/check-state/', api_views.CartViewSet.as_view({"post": "get_cart_by_hash_or_combine"})),
    path('api/cart/item', api_views.CartViewSet.as_view({
        "post": "add_cart_item",
        "delete": "remove_cart_item",
        "put": "update_cart_item"
    })),
    path('api/order', api_views.OrderViewSet.as_view({
        "post": "create_order",
        "get": "get_orders",
    })),
    path('api/products/<order>', api_views.ProductListView.as_view()),
    path('api/product/<pk>', api_views.ProductDetailView.as_view()),
    path('api/brands', api_views.BrandsListView.as_view()),
    path('api/filter', api_views.ProductsFilterAPIView.as_view()),
]

if project_settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
