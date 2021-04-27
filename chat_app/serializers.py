from rest_framework import serializers
from .models import *
from django.contrib.auth import authenticate

class TextSerializer(serializers.ModelSerializer):

    class Meta:
        model = Text
        fields = '__all__'

class Heading_2Serializer(serializers.ModelSerializer):

    class Meta:
        model = Heading_2
        fields = '__all__'

class Heading_1Serializer(serializers.ModelSerializer):

    class Meta:
        model = Heading_1
        fields = '__all__'

# Kanban Serializers_____________________________________
class Kanban_CardSerializer(serializers.ModelSerializer):

    class Meta:
        model = Kanban_Card
        fields = '__all__'

class Kanban_GroupSerializer(serializers.ModelSerializer):

    kanban_card = serializers.SerializerMethodField()

    class Meta:
        model = Kanban_Group
        fields = '__all__'

    def get_kanban_card(self, instance):
        cards = instance.kanban_card.all().order_by('order_on_group')
        return Kanban_CardSerializer(cards, many=True, read_only=True).data

class KanbanSerializer(serializers.ModelSerializer):

    kanban_group = serializers.SerializerMethodField()

    class Meta:
        model = Kanban
        fields = '__all__'
    
    def get_kanban_group(self, instance):
        groups = instance.kanban_group.all().order_by('order')
        return Kanban_GroupSerializer(groups, many=True, read_only=True).data
#_________________________________________________________

class PageLinkSerializer(serializers.ModelSerializer):

    page_name = serializers.CharField(source='page.name', read_only=True)

    class Meta:
        model = PageLink
        fields = ('id', 'page', 'page_element', 'page_name')

class ToDoSerializer(serializers.ModelSerializer):

    class Meta:
        model = To_do
        fields = '__all__'

# Table Serializers___________________________________
class TagSerializer(serializers.ModelSerializer):

    class Meta:
        model = Tag
        fields = '__all__'

class TableDataSerializer(serializers.ModelSerializer):
    tags = TagSerializer(many=True, read_only=True)
    tag_heads = TagSerializer(many=True, read_only=True)

    class Meta:
        model = Table_data
        fields = '__all__'

class TableRowSerializer(serializers.ModelSerializer):  
    data = serializers.SerializerMethodField()

    class Meta:
        model = Table_row
        fields = '__all__'

    def get_data(self, instance):
        data = instance.data.all().order_by('order')
        return TableDataSerializer(data, many=True, read_only=True).data

class TableSerializer(serializers.ModelSerializer):
    rows = serializers.SerializerMethodField()

    class Meta:
        model = Table
        fields = '__all__'

    def get_rows(self, instance):
        rows = instance.rows.all().order_by('order')
        return TableRowSerializer(rows, many=True, read_only=True).data
#_________________________________________________________
class Page_elementSerializer(serializers.ModelSerializer):
    heading_1 = Heading_1Serializer(many=True, read_only=True)
    heading_2 = Heading_2Serializer(many=True, read_only=True)
    text = TextSerializer(many=True, read_only=True)
    kanban = KanbanSerializer(many=True, read_only=True)
    page_link = PageLinkSerializer(many=True, read_only=True)
    to_do = ToDoSerializer(many=True, read_only=True)
    table = TableSerializer(many=True, read_only=True)

    class Meta:
        model = Page_element
        fields = '__all__'

class PageSerializer(serializers.ModelSerializer):
    page_elements = serializers.SerializerMethodField()

    class Meta:
        model = Page
        fields = '__all__'
    
    def get_fields(self):
        fields = super(PageSerializer, self).get_fields()
        fields['children'] = PageSerializer(many=True, required=False)

        return fields

    def get_pages(self, instance):
        pages = instance.pages.all().order_by('id')
        return PageSerializer(pages, many=True, read_only=True).data

    def get_page_elements(self, instance):
        elements = instance.page_elements.all().order_by('order_on_page')
        return Page_elementSerializer(elements, many=True, read_only=True).data

class AddPageSerializer(serializers.ModelSerializer):

    page_elements = Page_elementSerializer

    class Meta:
        model = Page
        fields = '__all__'

class UserSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name')

class RegisterSerializer(serializers.ModelSerializer):

    class Meta:
        model = User
        fields = ('id', 'email', 'first_name', 'last_name', 'password')
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User.objects.create_user(validated_data['email'], validated_data['first_name'], validated_data['last_name'],
        validated_data['password'])

        return user

class LoginSerializer(serializers.Serializer):
    
    email = serializers.EmailField()
    password = serializers.CharField()

    def validate(self, data):
        user = authenticate(**data)
        if user and user.is_active:
            return user
        raise serializers.ValidationError("Incorrect Credentials")
    
    