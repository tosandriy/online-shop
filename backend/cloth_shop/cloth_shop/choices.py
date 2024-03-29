COLORS = (
    ('r', 'Красный'),
    ('g', 'Зеленый'),
    ('b', 'Синий'),
    ('y', 'Желтый'),
    ('b', 'Черный'),
    ('w', 'Белый'),
    ('p', 'Розовый'),
    ('s', 'Серебряный'),
)

STATUSES = (
    ('waiting_for_capture', 'Ожидается оплата'),
    ('succeeded','Оплачено'),
    ('canceled','Отменено'),
)

SIZES = (
    ('XS', 'XS'),
    ('S', 'S'),
    ('M', 'M'),
    ('L', 'L'),
    ('XL', 'XL'),
    ('XXL', 'XXL'),
)

FIELDS = (
    ("amount_XS", "XS"), ("amount_S", "S"),
    ("amount_M", "M"), ("amount_L", "L"),
    ("amount_XL", "XL"), ("amount_XXL", "XXL")
)

SEASONS = (
    ('1', 'Любой'),
    ('2', 'Лето'),
    ('3', 'Зима'),
    ('4', 'Осень'),
    ('5', 'Весна'),
)

TYPES = (
    ('all', 'Все'),
    ('t-shirts', 'Футболки'),
    ('hoodie', 'Худи'),
    ('polo', 'Поло'),
    ('shirts', 'Рубашки'),
)

CART_STATUSES = (
    ('new', 'Новая'),
    ('paid', 'Оплачена'),
    ('preparing', 'Готовится к отправке'),
    ('shipping', 'В пути'),
    ('delivered', 'Доставлен'),
)