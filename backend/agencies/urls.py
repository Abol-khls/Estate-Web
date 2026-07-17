from django.urls import path

from .views import AgencyMeView

urlpatterns = [
    path(
        "agency/me/",
        AgencyMeView.as_view(),
        name="agency-me"
    ),
]