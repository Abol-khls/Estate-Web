from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import PublicPropertyViewSet, PublicInquiryView, PublicAgencyView

router = DefaultRouter()
router.register("properties", PublicPropertyViewSet, basename="public-properties")

urlpatterns = [
    path(
        "inquiries/",
        PublicInquiryView.as_view(),
        name="public-inquiry"
    ),
    path(
        "agency/",
        PublicAgencyView.as_view(),
        name="public-agency"
    ),
    path(
        "",
        include(router.urls)
    ),
]