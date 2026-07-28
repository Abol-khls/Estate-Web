from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from django.urls import path, include
from rest_framework.permissions import IsAdminUser
from drf_spectacular.views import (
    SpectacularAPIView,
    SpectacularSwaggerView,
)
from rest_framework_simplejwt.views import (
    TokenRefreshView,
    TokenBlacklistView,
)

from users.views import ThrottledTokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),
    path(
        'api/',
        include('properties.urls'),


    ),
    path(
    'api/token/',
    ThrottledTokenObtainPairView.as_view(),
    name='token_obtain_pair'
    ),

    path(
        'api/token/refresh/',
        TokenRefreshView.as_view(),
        name='token_refresh'
    ),

    path(
        'api/token/blacklist/',
        TokenBlacklistView.as_view(),
        name='token_blacklist'
    ),
    path(
    'api/',
    include('customers.urls')
    ),
    path(
    'api/',
    include('activities.urls')
    ),
    path(
    'api/',
    include('visits.urls')
    ),
    path(
    'api/',
    include('contracts.urls')
    ),
    path(
    'api/dashboard/',
    include('dashboard.urls')
    ),
    path(
    'api/',
    include('users.urls')
    ),
    path(
    'api/',
    include('agencies.urls')
    ),
    path(
    'api/public/',
    include('public.urls')
    ),
    path(
    'api/reports/',
    include('reports.urls')
    ),
    path(
    'api/schema/',
    SpectacularAPIView.as_view(permission_classes=[IsAdminUser]),
    name='schema'
    ),

    path(
        'api/docs/',
        SpectacularSwaggerView.as_view(
            url_name='schema',
            permission_classes=[IsAdminUser]
        ),
        name='swagger-ui'
    ),

]

if settings.DEBUG:
    urlpatterns += static(
        settings.MEDIA_URL,
        document_root=settings.MEDIA_ROOT
    )