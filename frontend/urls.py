from django.urls import path
from .import views
urlpatterns = [
    path('', views.index, name="index"),
    path('login', views.index, name="index"),
    path('register', views.index, name="index"),
    path('<str:pageId>', views.index, name="index")
]