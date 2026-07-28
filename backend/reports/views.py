from datetime import date, timedelta

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.exceptions import ValidationError
from django.http import HttpResponse
from drf_spectacular.utils import extend_schema
from drf_spectacular.types import OpenApiTypes

from core.permissions import IsAgentOrManager

from .services import get_full_report
from .excel_export import build_report_excel
from .pdf_export import build_report_pdf


def _parse_date_range(request):

    today = date.today()

    default_start = today - timedelta(days=180)

    start_str = request.query_params.get('start_date')

    end_str = request.query_params.get('end_date')

    try:

        start_date = (
            date.fromisoformat(start_str) if start_str else default_start
        )

        end_date = (
            date.fromisoformat(end_str) if end_str else today
        )

    except ValueError:

        raise ValidationError(
            {"detail": "فرمت تاریخ نامعتبر است. از YYYY-MM-DD استفاده کنید."}
        )

    if start_date > end_date:

        raise ValidationError(
            {"detail": "تاریخ شروع نمی‌تواند بعد از تاریخ پایان باشد."}
        )

    return start_date, end_date


class ReportSummaryView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAgentOrManager
    ]

    @extend_schema(responses=OpenApiTypes.OBJECT)
    def get(self, request):

        agency = request.user.agency

        if not agency:

            return Response({
                "sales": [],
                "agents": [],
                "customers": {
                    "total": 0,
                    "converted": 0,
                    "conversion_rate": 0,
                    "by_request_type": []
                },
                "property_prices": [],
            })

        start_date, end_date = _parse_date_range(request)

        data = get_full_report(agency, start_date, end_date)

        return Response(data)


class ReportExportView(APIView):

    permission_classes = [
        IsAuthenticated,
        IsAgentOrManager
    ]

    @extend_schema(responses={200: OpenApiTypes.BINARY})
    def get(self, request):

        agency = request.user.agency

        start_date, end_date = _parse_date_range(request)

        export_format = request.query_params.get('export_format', 'excel')

        data = get_full_report(agency, start_date, end_date) if agency else {
            "sales": [], "agents": [],
            "customers": {"total": 0, "converted": 0, "conversion_rate": 0, "by_request_type": []},
            "property_prices": [],
        }

        if export_format == 'pdf':

            buffer = build_report_pdf(data, agency, start_date, end_date)

            response = HttpResponse(
                buffer.getvalue(),
                content_type='application/pdf'
            )

            response['Content-Disposition'] = (
                f'attachment; filename="report-{start_date}-to-{end_date}.pdf"'
            )

            return response

        buffer = build_report_excel(data, start_date, end_date)

        response = HttpResponse(
            buffer.getvalue(),
            content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        )

        response['Content-Disposition'] = (
            f'attachment; filename="report-{start_date}-to-{end_date}.xlsx"'
        )

        return response