from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError

from core.permissions import IsManager
from core.viewsets import AgencyScopedViewSet

from .serializers import (
    UserSerializer,
    ChangePasswordSerializer,
    TeamMemberSerializer,
)
from .models import User


class MeView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    def get(self, request):

        serializer = UserSerializer(
            request.user
        )

        return Response(
            serializer.data
        )

    def patch(self, request):

        serializer = UserSerializer(
            request.user,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(serializer.data)


class ChangePasswordView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

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

    def get_queryset(self):

        return super().get_queryset().exclude(
            role='customer'
        ).order_by('-date_joined')

    def perform_update(self, serializer):

        instance = serializer.instance

        deactivating_self = (
            instance == self.request.user
            and str(self.request.data.get('is_active')).lower() == 'false'
        )

        if deactivating_self:
            raise ValidationError(
                "امکان غیرفعال کردن حساب خودتان وجود ندارد."
            )

        serializer.save(agency=self.request.user.agency)

    def perform_destroy(self, instance):

        if instance == self.request.user:
            raise ValidationError(
                "امکان حذف حساب خودتان وجود ندارد."
            )

        instance.delete()