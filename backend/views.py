from django.shortcuts import render
from django.http import HttpResponseRedirect
from .models import *

from rest_framework import viewsets, permissions, generics, status
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from .serializers import *

from knox.models import AuthToken
from django.conf import settings

#https://medium.com/a-layman/build-single-page-application-with-react-and-django-part-1-connect-react-app-with-django-app-dbf6b5ec52f4

# Page API
class PageViewSet(viewsets.ModelViewSet):
    def get_queryset(self):
        user_id = self.request.query_params.get('user_id')
        orphan = self.request.query_params.get('orphan')

        if user_id and orphan:
            queryset = Page.objects.filter(creator=user_id, parent=None)
        elif user_id:
            queryset = Page.objects.filter(creator=user_id)
        elif orphan:
            queryset = Page.objects.filter(parent=None)
        else:
            queryset = Page.objects.all()
        return queryset.order_by('id')
    serializer_class = PageSerializer

# Add Page API
class AddPageViewSet(viewsets.ModelViewSet):
    queryset = Page.objects.all()
    serializer_class = AddPageSerializer

# Page_element API
class Page_elementViewSet(viewsets.ModelViewSet):
    queryset = Page_element.objects.all().order_by('order_on_page')
    serializer_class = Page_elementSerializer

# Heading_1 API
class Heading_1ViewSet(viewsets.ModelViewSet):
    queryset = Heading_1.objects.all()
    serializer_class = Heading_1Serializer

# Heading_2 API
class Heading_2ViewSet(viewsets.ModelViewSet):
    queryset = Heading_2.objects.all()
    serializer_class = Heading_2Serializer

# Text API
class TextViewSet(viewsets.ModelViewSet):
    queryset = Text.objects.all()
    serializer_class = TextSerializer

# Kanban API
class KanbanViewSet(viewsets.ModelViewSet):
    queryset = Kanban.objects.all()
    serializer_class = KanbanSerializer

# Kanban_Group API
class Kanban_GroupViewSet(viewsets.ModelViewSet):
    queryset = Kanban_Group.objects.all()
    serializer_class = Kanban_GroupSerializer

# Kanban_Card API
class Kanban_CardViewSet(viewsets.ModelViewSet):
    queryset = Kanban_Card.objects.all().order_by('order_on_group')
    serializer_class = Kanban_CardSerializer

# PageLink API
class PageLinkViewSet(viewsets.ModelViewSet):
    queryset = PageLink.objects.all()
    serializer_class = PageLinkSerializer

# PageLink API
class ToDoViewSet(viewsets.ModelViewSet):
    queryset = To_do.objects.all()
    serializer_class = ToDoSerializer

# Table API
class TableViewSet(viewsets.ModelViewSet):
    queryset = Table.objects.all()
    serializer_class = TableSerializer

# Table Row API
class TableRowViewSet(viewsets.ModelViewSet):
    queryset = Table_row.objects.all()
    serializer_class = TableRowSerializer

# Table Data API
class TableDataViewSet(viewsets.ModelViewSet):
    queryset = Table_data.objects.all()
    serializer_class = TableDataSerializer

# Tag API
class TagViewSet(viewsets.ModelViewSet):
    queryset = Tag.objects.all()
    serializer_class = TagSerializer

#Register API 
class RegisterAPI(generics.GenericAPIView):
    serializer_class = RegisterSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

#Login API
class LoginAPI(generics.GenericAPIView):
    serializer_class = LoginSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data
        return Response({
            "user": UserSerializer(user, context=self.get_serializer_context()).data,
            "token": AuthToken.objects.create(user)[1]
        })

#Get User API
class UserAPI(generics.RetrieveAPIView):
    permission_classes = [
        permissions.IsAuthenticated,
    ]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user