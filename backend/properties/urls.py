from rest_framework.routers import DefaultRouter

from .views import PropertyViewSet

router = DefaultRouter()

router.register(
    r'properties',
    PropertyViewSet
)

urlpatterns = router.urls