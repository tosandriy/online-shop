from django import forms
from django.contrib.auth.forms import AuthenticationForm, UserCreationForm
from django.contrib.auth import get_user_model


User = get_user_model()


class UserLogInForm(AuthenticationForm):
    password = forms.CharField(max_length=120, label="Пароль", strip=False,
                               widget=forms.PasswordInput(attrs={'autocomplete': 'current-password'}), )
    remember_me = forms.BooleanField(label='Запомнить',required=False)


class UserRegisterForm(UserCreationForm):
    email = forms.EmailField(label="Почта",max_length=150)
    password1 = forms.CharField(label="Пароль",max_length=80,strip=False,
                                widget=forms.PasswordInput(attrs={'autocomplete': 'current-password'}))
    password2 = forms.CharField(label="Подтверждение пароля",max_length=80,strip=False,
                                widget=forms.PasswordInput(attrs={'autocomplete': 'current-password'}))

    def clean_email(self) :
        email = self.cleaned_data.get('email')
        if email and User.objects.filter(email=email).exists() :
            raise forms.ValidationError(u'Уже существует аккаунт с такой почтой.')
        return email

    class Meta:
        model = User
        fields = ['email', 'password1', 'password2']