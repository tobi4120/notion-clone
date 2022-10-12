from django.urls import include, path
from rest_framework import routers
from . import views
from knox import views as knox_views
from .views import RegisterAPI, LoginAPI, UserAPI

router = routers.DefaultRouter()
router.register(r'pages', views.PageViewSet, basename='Pages')
router.register(r'add_pages', views.AddPageViewSet)
router.register(r'page_elements', views.Page_elementViewSet)
router.register(r'Heading_1s', views.Heading_1ViewSet)
router.register(r'Heading_2s', views.Heading_2ViewSet)
router.register(r'Texts', views.TextViewSet)
router.register(r'pageLinks', views.PageLinkViewSet)
router.register(r'to_dos', views.ToDoViewSet)

router.register(r'kanbans', views.KanbanViewSet)
router.register(r'kanban_groups', views.Kanban_GroupViewSet)
router.register(r'kanban_cards', views.Kanban_CardViewSet)

router.register(r'tables', views.TableViewSet)
router.register(r'table_rows', views.TableRowViewSet)
router.register(r'table_data', views.TableDataViewSet)
router.register(r'tags', views.TagViewSet)

urlpatterns = [
    path("api_", include(router.urls)),
    path("registerAPI", RegisterAPI.as_view()),
    path("loginAPI", LoginAPI.as_view()),
    path("userAPI", UserAPI.as_view()),
    path("logoutAPI", knox_views.LogoutView.as_view(), name='knox_logout'),
    path("auth", include('knox.urls'))
]