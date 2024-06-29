from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login, authenticate
from django.contrib.auth.forms import AuthenticationForm
from .forms import RegistroUsuarioForm, PagoForm
from .models import Producto, Pedido, LineaPedido, UserProfile
from django.contrib.auth.decorators import login_required
from django.db import models
from itertools import cycle
from django.http import JsonResponse

def obtener_conteo_carrito(request):
    if request.user.is_authenticated:
        pedido = Pedido.objects.filter(usuario=request.user, finalizado=False).first()
        if pedido:
            total = pedido.lineas.aggregate(total=models.Sum('cantidad'))['total']
            return total if total else 0
    return 0

def index(request):
    productos = Producto.objects.all()
    conteo_carrito = obtener_conteo_carrito(request)
    return render(request, 'carrito/index.html', {'productos': productos, 'conteo_carrito': conteo_carrito})

def registro(request):
    if request.method == 'POST':
        form = RegistroUsuarioForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            return redirect('index')
    else:
        form = RegistroUsuarioForm()
    conteo_carrito = obtener_conteo_carrito(request)
    return render(request, 'carrito/registro.html', {'form': form, 'conteo_carrito': conteo_carrito})

def login_view(request):
    if request.method == 'POST':
        form = AuthenticationForm(request, data=request.POST)
        if form.is_valid():
            user = form.get_user()
            login(request, user)
            return redirect('index')
    else:
        form = AuthenticationForm()
    conteo_carrito = obtener_conteo_carrito(request)
    return render(request, 'carrito/login.html', {'form': form, 'conteo_carrito': conteo_carrito})

@login_required
def agregar_al_carrito(request, producto_id):
    producto = Producto.objects.get(id=producto_id)
    pedido, creado = Pedido.objects.get_or_create(usuario=request.user, finalizado=False)
    linea_pedido, creado = LineaPedido.objects.get_or_create(pedido=pedido, producto=producto)
    if not creado:
        linea_pedido.cantidad += 1
    else:
        linea_pedido.cantidad = 1
    linea_pedido.save()
    return redirect('index')

@login_required
def eliminar_del_carrito(request, producto_id):
    producto = get_object_or_404(Producto, id=producto_id)
    pedido = Pedido.objects.filter(usuario=request.user, finalizado=False).first()
    if pedido:
        linea_pedido = LineaPedido.objects.filter(pedido=pedido, producto=producto).first()
        if linea_pedido:
            if linea_pedido.cantidad > 1:
                linea_pedido.cantidad -= 1
                linea_pedido.save()
            else:
                linea_pedido.delete()
    return redirect('ver_carrito')

@login_required
def ver_carrito(request):
    pedido = Pedido.objects.filter(usuario=request.user, finalizado=False).first()
    conteo_carrito = obtener_conteo_carrito(request)
    total_articulos = 0
    total_precio = 0.0
    lineas = []
    if pedido:
        total_articulos = pedido.lineas.aggregate(total=models.Sum('cantidad'))['total']
        total_precio = sum(linea.producto.precio * linea.cantidad for linea in pedido.lineas.all())
        for linea in pedido.lineas.all():
            lineas.append({
                'producto': linea.producto,
                'cantidad': linea.cantidad,
                'precio_total': linea.producto.precio * linea.cantidad
            })
    return render(request, 'carrito/ver_carrito.html', {
        'lineas': lineas,
        'conteo_carrito': conteo_carrito,
        'total_articulos': total_articulos,
        'total_precio': total_precio,
    })

@login_required
def pagar(request):
    pedido = Pedido.objects.filter(usuario=request.user, finalizado=False).first()
    if request.method == 'POST':
        form = PagoForm(request.POST)
        if form.is_valid():
            # Aquí puedes manejar el proceso de pago y guardar los datos del cliente
            pedido.finalizado = True
            pedido.save()
            return redirect('agradecimiento')
    else:
        form = PagoForm()
    return render(request, 'carrito/pagar.html', {'form': form})

@login_required
def agradecimiento(request):
    return render(request, 'carrito/agradecimiento.html')

from django.http import JsonResponse

@login_required
def agregar_al_carrito_ajax(request, producto_id):
    if request.method == "POST":
        producto = Producto.objects.get(id=producto_id)
        pedido, creado = Pedido.objects.get_or_create(usuario=request.user, finalizado=False)
        linea_pedido, creado = LineaPedido.objects.get_or_create(pedido=pedido, producto=producto)
        if not creado:
            linea_pedido.cantidad += 1
        else:
            linea_pedido.cantidad = 1
        linea_pedido.save()
        total_items = pedido.lineas.aggregate(total=models.Sum('cantidad'))['total']
        return JsonResponse({'total_items': total_items, 'mensaje': 'Producto agregado al carrito'})
    return JsonResponse({'error': 'Método no permitido'}, status=405)

@login_required
def dashboard(request):
    if not request.user.userprofile.user_type == 'admin':
        return redirect('index')
    return render(request, 'carrito/dashboard.html')