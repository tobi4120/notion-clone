# Generated by Django 3.1 on 2020-12-12 02:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('chat_app', '0015_page_element_order_on_page'),
    ]

    operations = [
        migrations.AlterField(
            model_name='page_element',
            name='order_on_page',
            field=models.FloatField(),
        ),
    ]
