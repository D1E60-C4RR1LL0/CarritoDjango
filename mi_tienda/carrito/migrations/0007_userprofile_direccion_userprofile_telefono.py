# Generated by Django 5.0.6 on 2024-07-01 07:27

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('carrito', '0006_alter_producto_nombre'),
    ]

    operations = [
        migrations.AddField(
            model_name='userprofile',
            name='direccion',
            field=models.CharField(blank=True, max_length=255, null=True),
        ),
        migrations.AddField(
            model_name='userprofile',
            name='telefono',
            field=models.CharField(blank=True, max_length=20, null=True),
        ),
    ]
