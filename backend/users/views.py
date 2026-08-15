from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.exceptions import ValidationError
from drf_spectacular.utils import extend_schema, OpenApiResponse
from drf_spectacular.types import OpenApiTypes

from django.conf import settings as django_settings

from core.permissions import IsManager
from core.viewsets import AgencyScopedViewSet
from core.mixins import AuditActorMixin
from core.throttling import LoginIPRateThrottle, LoginUsernameRateThrottle

from rest_framework_simplejwt.serializers import (
    TokenObtainPairSerializer,
    TokenRefreshSerializer,
)
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.exceptions import TokenError, InvalidToken

from .serializers import (
    UserSerializer,
    ChangePasswordSerializer,
    TeamMemberSerializer,
)
from .models import User


REFRESH_COOKIE_NAME = 'refresh_token'

REFRESH_COOKIE_PATH = '/api/token/'


def set_refresh_cookie(response, refresh_token):

    response.set_cookie(
        REFRESH_COOKIE_NAME,
        str(refresh_token),
        max_age=int(
            django_settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()
        ),
        httponly=True,
        secure=not django_settings.DEBUG,
        samesite='Lax',
        path=REFRESH_COOKIE_PATH,
    )


class MeView(AuditActorMixin, APIView):

    permission_classes = [
        IsAuthenticated
    ]

    @extend_schema(responses=UserSerializer)
    def get(self, request):

        serializer = UserSerializer(
            request.user
        )

        return Response(
            serializer.data
        )

    @extend_schema(request=UserSerializer, responses=UserSerializer)
    def patch(self, request):

        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(serializer.data)


class ChangePasswordView(AuditActorMixin, APIView):

    permission_classes = [
        IsAuthenticated
    ]

    @extend_schema(
        request=ChangePasswordSerializer,
        responses={
            200: OpenApiResponse(
                response=OpenApiTypes.OBJECT,
                description="رمز عبور با موفقیت تغییر کرد."
            )
        }
    )
    def post(self, request):

        serializer = ChangePasswordSerializer(
            data=request.data,
            context={"request": request}
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            {"detail": "رمز عبور با موفقیت تغییر کرد."}
        )


class TeamViewSet(AgencyScopedViewSet):

    queryset = User.objects.all()

    serializer_class = TeamMemberSerializer

    permission_classes = [
        IsAuthenticated,
        IsManager
    ]

    http_method_names = [
        'get',
        'patch',
        'delete',
        'head',
        'options',
    ]

    def get_queryset(self):

        return super().get_queryset().exclude(
            role='customer'
        ).order_by('-date_joined')

    def _is_false(self, value):

        if isinstance(value, bool):
            return value is False

        return str(value).strip().lower() in ('false', '0')

    def _would_remove_last_manager(self, instance, new_role, new_is_active):

        losing_manager_status = (
            instance.role == 'manager'
            and (new_role != 'manager' or new_is_active is False)
        )

        if not losing_manager_status:
            return False

        remaining_active_managers = User.objects.filter(
            agency=self.request.user.agency,
            role='manager',
            is_active=True,
        ).exclude(pk=instance.pk).count()

        return remaining_active_managers == 0

    def perform_update(self, serializer):

        instance = serializer.instance

        deactivating_self = (
            instance == self.request.user
            and 'is_active' in self.request.data
            and self._is_false(self.request.data.get('is_active'))
        )

        if deactivating_self:
            raise ValidationError(
                "امکان غیرفعال کردن حساب خودتان وجود ندارد."
            )

        new_role = self.request.data.get('role', instance.role)

        if 'is_active' in self.request.data:
            new_is_active = not self._is_false(self.request.data.get('is_active'))
        else:
            new_is_active = instance.is_active

        if self._would_remove_last_manager(instance, new_role, new_is_active):
            raise ValidationError(
                "حداقل یک مدیر فعال باید در آژانس باقی بماند."
            )

        serializer.save(agency=self.request.user.agency)

    def perform_destroy(self, instance):

        if instance == self.request.user:
            raise ValidationError(
                "امکان حذف حساب خودتان وجود ندارد."
            )

        if self._would_remove_last_manager(instance, instance.role, False):
            raise ValidationError(
                "حداقل یک مدیر فعال باید در آژانس باقی بماند."
            )

        instance.delete()


class CookieTokenObtainPairView(APIView):

    permission_classes = [AllowAny]

    throttle_classes = [
        LoginIPRateThrottle,
        LoginUsernameRateThrottle,
    ]

    @extend_schema(responses={200: OpenApiTypes.OBJECT})
    def post(self, request):

        serializer = TokenObtainPairSerializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        data = dict(serializer.validated_data)

        refresh = data.pop('refresh')

        response = Response(data)

        set_refresh_cookie(response, refresh)

        return response


class CookieTokenRefreshView(APIView):

    permission_classes = [AllowAny]

    @extend_schema(responses={200: OpenApiTypes.OBJECT})
    def post(self, request):

        raw_refresh = request.COOKIES.get(REFRESH_COOKIE_NAME)

        if not raw_refresh:
            raise InvalidToken('No refresh token cookie found.')

        serializer = TokenRefreshSerializer(data={'refresh': raw_refresh})

        try:
            serializer.is_valid(raise_exception=True)
        except TokenError as error:
            raise InvalidToken(str(error))
        except Exception:
            raise InvalidToken('Refresh token is invalid or malformed.')

        data = dict(serializer.validated_data)

        new_refresh = data.pop('refresh', None)

        response = Response(data)

        if new_refresh:
            set_refresh_cookie(response, new_refresh)

        return response


class CookieTokenLogoutView(APIView):

    permission_classes = [AllowAny]

    @extend_schema(responses={200: OpenApiTypes.OBJECT})
    def post(self, request):

        raw_refresh = request.COOKIES.get(REFRESH_COOKIE_NAME)

        if raw_refresh:

            try:
                RefreshToken(raw_refresh).blacklist()
            except TokenError:
                pass

        response = Response({"detail": "خارج شدید."})

        response.delete_cookie(
            REFRESH_COOKIE_NAME,
            path=REFRESH_COOKIE_PATH,
        )

        return response