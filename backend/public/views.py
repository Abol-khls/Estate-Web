from rest_framework import viewsets, generics
from rest_framework.permissions import AllowAny
from rest_framework.filters import SearchFilter, OrderingFilter
from rest_framework.throttling import AnonRateThrottle
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.pagination import PageNumberPagination

from django_filters.rest_framework import DjangoFilterBackend

from properties.models import Property
from properties.filters import PropertyFilter
from agencies.models import Agency
from agencies.serializers import AgencySerializer

from .serializers import (
    PublicPropertyListSerializer,
    PublicPropertyDetailSerializer,
    PublicInquirySerializer,
)


class InquiryRateThrottle(AnonRateThrottle):

    scope = "public_inquiry"


class PublicPropertyPagination(PageNumberPagination):

    page_size = 20


class PublicPropertyViewSet(viewsets.ReadOnlyModelViewSet):

    permission_classes = [AllowAny]

    pagination_class = PublicPropertyPagination

    filter_backends = [
        DjangoFilterBackend,
        SearchFilter,
        OrderingFilter
    ]

    filterset_class = PropertyFilter

    search_fields = [
        "title",
        "address",
    ]

    ordering_fields = [
        "price",
        "area",
        "created_at",
    ]

    ordering = ["-created_at"]

    def get_queryset(self):

        return Property.objects.filter(
            status="available"
        )

    def get_serializer_class(self):

        if self.action == "retrieve":
            return PublicPropertyDetailSerializer

        return PublicPropertyListSerializer

    def get_serializer_context(self):

        context = super().get_serializer_context()

        context["request"] = self.request

        return context


class PublicInquiryView(generics.CreateAPIView):

    permission_classes = [AllowAny]

    throttle_classes = [InquiryRateThrottle]

    serializer_class = PublicInquirySerializer

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)

        serializer.is_valid(raise_exception=True)

        serializer.save()

        return Response(
            {"detail": "درخواست شما با موفقیت ثبت شد. به‌زودی با شما تماس گرفته می‌شود."}
        )


class PublicAgencyView(APIView):

    permission_classes = [AllowAny]

    def get(self, request):

        agency = Agency.objects.first()

        if not agency:
            return Response({})

        serializer = AgencySerializer(agency)

        return Response(serializer.data)