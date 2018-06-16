from django.conf.urls import url, include
from rest_framework.routers import DefaultRouter
from english import views
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

router = DefaultRouter()
#router.register(r'users', views.UserViewSet)
router.register(r'words', views.WordViewSet)
router.register(r'vocabularies', views.VocabularyViewSet)

urlpatterns = [
    url('^token$', obtain_jwt_token),
    url('^refreshed_token$', refresh_jwt_token),
    url(r'^', include(router.urls)),
]