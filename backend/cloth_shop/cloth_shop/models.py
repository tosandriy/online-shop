from django.db import models
from django.utils import timezone
from django.utils.timezone import now
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager

from loguru import logger

from . import choices

import uuid


class Brand(models.Model):
    """A brand of the Product"""
    name = models.CharField(max_length=100)
    logo = models.ImageField(upload_to='cloth_shop/media/images/logo_photos')

    def __str__(self):
        return self.name


class Product(models.Model):
    """A model for all products in the shop"""
    name = models.CharField(max_length=100)
    cloth_type = models.CharField(choices=choices.TYPES, max_length=15)
    main_photo = models.ImageField(upload_to='cloth_shop/media/images/main_photos', default='no_photo.png')
    price = models.FloatField(null=False)
    season = models.CharField(choices=choices.SEASONS, max_length=10)
    brand = models.ManyToManyField(to=Brand, related_name="products")
    sold = models.IntegerField(default=0)
    release = models.DateField(default=now)
    amount_XS = models.IntegerField(default=0)
    amount_S = models.IntegerField(default=0)
    amount_M = models.IntegerField(default=0)
    amount_L = models.IntegerField(default=0)
    amount_XL = models.IntegerField(default=0)
    amount_XXL = models.IntegerField(default=0)

    def get_able_sizes(self):
        return (field[0] for field in choices.FIELDS if getattr(self, field[0]))

    def __str__(self):
        return "{} | {}".format(self.name,self.price)


class Photo(models.Model):
    """A photo of the product"""
    photo = models.ImageField(upload_to='cloth_shop/media/images/product_photos')
    product = models.ForeignKey(to=Product, on_delete=models.CASCADE, related_name='photos')


class ShippingInfo(models.Model):
    first_name = models.CharField(
        verbose_name='Имя',
        max_length=64,
        unique=False,
        null=True,
        editable=True
    )

    surname = models.CharField(
        verbose_name='Фамилия',
        max_length=128,
        unique=False,
        null=True,
        editable=True
    )

    patronymic = models.CharField(
        verbose_name='Отчество',
        max_length=64,
        unique=False,
        null=True,
        editable=True
    )

    phone_number = models.CharField(
        verbose_name='Телефон',
        max_length=16,
        unique=False,
        null=True,
        editable=True
    )

    country = models.CharField(
        verbose_name='Страна',
        max_length=64,
        unique=False,
        null=True,
        editable=True
    )

    city = models.CharField(
        verbose_name='Город',
        max_length=64,
        unique=False,
        null=True,
        editable=True
    )

    region = models.CharField(
        verbose_name='Край/область/регион',
        max_length=64,
        unique=False,
        null=True,
        editable=True
    )

    street = models.CharField(
        verbose_name='Улица',
        max_length=64,
        unique=False,
        null=True,
        editable=True
    )

    building = models.CharField(
        verbose_name='Дом',
        max_length=64,
        unique=False,
        null=True,
        editable=True
    )

    flat = models.CharField(
        verbose_name='Квартира',
        max_length=64,
        unique=False,
        null=True,
        editable=True
    )

    index = models.CharField(
        verbose_name='Индекс',
        max_length=64,
        unique=False,
        null=True,
        editable=True
    )


class MyUserManager(BaseUserManager):
    """Custom BaseUserManager model with email instead of name"""

    def create_user(self, email, password=None):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.model(
            email=MyUserManager.normalize_email(email),
            password=password,
        )

        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password):
        if not email:
            raise ValueError('Users must have an email address')

        user = self.create_user(
            email=email,
            password=password,
        )

        user.is_superuser = True
        user.save(using=self._db)
        return user


class MyUser(AbstractBaseUser):
    """Custom user model with email instead of name"""
    email = models.EmailField(
        verbose_name='Почта',
        max_length=255,
        unique=True,
        db_index=True,
        name="email"
    )

    shipping_info = models.ForeignKey(to=ShippingInfo,
                                      on_delete=models.CASCADE,
                                      null=True,
                                      related_name="user")

    is_superuser = models.BooleanField(default=False)

    objects = MyUserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['password']

    @property
    def has_completed_shipping_info(self):
        shipping_info_fields = self.shipping_info._meta.get_fields()
        logger.info(shipping_info_fields)
        for shipping_info_field in shipping_info_fields:
            logger.info(shipping_info_field.name)
            logger.info(getattr(self.shipping_info, shipping_info_field.name))
            if not getattr(self.shipping_info, shipping_info_field.name):
                return False
        return True

    def get_username(self):
        return self.email

    def has_perm(self, perm, obj=None):
        return True

    def has_module_perms(self, app_label):
        return True

    @property
    def is_staff(self):
        return self.is_superuser


class Item(models.Model):
    """A product with extra info for order"""
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, unique=True)
    product = models.ForeignKey(Product, on_delete=models.CASCADE)
    size = models.CharField(choices=choices.SIZES, max_length=10)
    amount = models.IntegerField(default=1)


class Order(models.Model):
    """An order that user paid for"""
    created_at = models.DateTimeField(editable=False, default=now)
    status = models.CharField(choices=choices.STATUSES, default=choices.STATUSES[0][0], max_length=20)
    owner = models.ForeignKey(MyUser, on_delete=models.CASCADE, related_name='orders')
    shipping_info = models.ForeignKey(ShippingInfo, on_delete=models.CASCADE, related_name='order')
    items = models.ManyToManyField(Item)
    payment_id = models.CharField(max_length=100, unique=True, null=True)

    def get_price(self):
        items_price = sum((item.product.price * item.amount for item in self.items.all().select_related("product")))
        return items_price if items_price > 500 else items_price + 500


class Cart(models.Model):
    """A model to store user's products he wants to buy"""
    id = models.UUIDField(default=uuid.uuid4, primary_key=True, unique=True)
    owner = models.OneToOneField(MyUser, related_name='cart',
                                 on_delete=models.CASCADE, unique=True,
                                 null=True, blank=True)
    items = models.ManyToManyField(Item)
    status = models.CharField(choices=choices.CART_STATUSES, default=choices.CART_STATUSES[0][0], max_length=20)

    def get_cart_price(self):
        return sum((item.product.price * item.amount for item in self.items.all().select_related("product")))

    def get_items_amount(self):
        return self.items.count()
