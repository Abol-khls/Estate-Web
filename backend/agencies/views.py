from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import PermissionDenied, NotFound
from drf_spectacular.utils import extend_schema

from .serializers import AgencySerializer


class AgencyMeView(APIView):

    permission_classes = [
        IsAuthenticated
    ]

    @extend_schema(responses=AgencySerializer)
    def get(self, request):

        agency = request.user.agency

        if not agency:
            raise NotFound("شما به هیچ آژانسی متصل نیستید.")

        serializer = AgencySerializer(agency)

        return Response(serializer.data)

    @extend_schema(request=AgencySerializer, responses=AgencySerializer)
    def patch(self, request):

        agency = request.user.agency

        if not agency:
            raise NotFound("شما به هیچ آژانسی متصل نیستید.")

        if request.user.role != 'manager':
            raise PermissionDenied(
                "فقط مدیر آژانس می‌تواند این اطلاعات را ویرایش کند."
            )

        serializer = AgencySerializer(
            agency,
            data=request.data,
            partial=True
        )

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(serializer.data)