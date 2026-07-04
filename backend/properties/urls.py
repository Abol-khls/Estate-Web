from rest_framework.routers import DefaultRouter

from .views import (
    PropertyViewSet,
    PropertyImageViewSet
)


router = DefaultRouter()

router.register(
    r'properties',
    PropertyViewSet
)
router.register(
    r'property-images',
    PropertyImageViewSet
)

urlpatterns = router.urls