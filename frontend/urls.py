from django.urls import path
from .import views
from django.contrib import admin

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', views.index, name="index"),
    path('login', views.index, name="index"),
    path('register', views.index, name="index"),
    path('<str:pageId>', views.index, name="index")
]