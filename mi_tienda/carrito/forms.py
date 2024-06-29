from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
import re
from itertools import cycle  
from .models import UserProfile


class RegistroUsuarioForm(UserCreationForm):
    email = forms.EmailField(required=True)
    user_type = forms.ChoiceField(choices=UserProfile.USER_TYPE_CHOICES, required=True)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2', 'user_type']

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data['email']
        if commit:
            user.save()
            # Crear el perfil del usuario si no existe
            UserProfile.objects.get_or_create(user=user, defaults={'user_type': self.cleaned_data['user_type']})
        return user

class PagoForm(forms.Form):
    nombre = forms.CharField(max_length=100, required=True)
    apellidos = forms.CharField(max_length=100, required=True)
    rut = forms.CharField(max_length=12, required=True)
    direccion = forms.CharField(max_length=255, required=True)
    telefono = forms.CharField(max_length=20, required=True)
    numero_tarjeta = forms.CharField(max_length=16, required=True, label="Número de Tarjeta")
    fecha_vencimiento = forms.CharField(
        max_length=5, 
        required=True, 
        label="Fecha de Vencimiento (MM/YY)",
        widget=forms.TextInput(attrs={'placeholder': 'MM/YY'})
    )
    cvv = forms.CharField(
        max_length=3, 
        required=True, 
        label="CVV", 
        widget=forms.PasswordInput(attrs={'placeholder': 'CVV'})
    )

    def clean_rut(self):
        rut = self.cleaned_data['rut']
        if not self.validar_rut(rut):
            raise forms.ValidationError("RUT inválido.")
        return rut

    def clean_telefono(self):
        telefono = self.cleaned_data['telefono']
        if not re.match(r'^\+?1?\d{9,15}$', telefono):
            raise forms.ValidationError("Número de teléfono inválido.")
        return telefono

    def clean_numero_tarjeta(self):
        numero_tarjeta = self.cleaned_data['numero_tarjeta']
        if not re.match(r'^\d{16}$', numero_tarjeta):
            raise forms.ValidationError("Número de tarjeta inválido.")
        return numero_tarjeta

    def clean_fecha_vencimiento(self):
        fecha_vencimiento = self.cleaned_data['fecha_vencimiento']
        if not re.match(r'^(0[1-9]|1[0-2])\/?([0-9]{2})$', fecha_vencimiento):
            raise forms.ValidationError("Fecha de vencimiento inválida.")
        return fecha_vencimiento

    def clean_cvv(self):
        cvv = self.cleaned_data['cvv']
        if not re.match(r'^\d{3}$', cvv):
            raise forms.ValidationError("CVV inválido.")
        return cvv

    def validar_rut(self, rut):
        rut = rut.replace(".", "").replace("-", "")
        rut, verificador = rut[:-1], rut[-1].upper()
        reversed_digits = map(int, reversed(rut))
        factors = cycle(range(2, 8))
        s = sum(d * f for d, f in zip(reversed_digits, factors))
        res = (-s) % 11
        if res == 10:
            res = 'K'
        return str(res) == verificador
    