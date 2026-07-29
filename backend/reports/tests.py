from io import BytesIO

import openpyxl

from rest_framework.test import APITestCase
from rest_framework import status

from agencies.models import Agency
from users.models import User


class ReportSummaryTests(APITestCase):

    def setUp(self):

        self.agency = Agency.objects.create(name="آژانس تست")

        self.agent = User.objects.create_user(
            username="agent_1",
            password="StrongPass123",
            role="agent",
            agency=self.agency,
        )

    def test_report_summary_requires_authentication(self):

        response = self.client.get("/api/reports/summary/")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_report_summary_accessible_to_agent(self):

        self.client.force_authenticate(user=self.agent)

        response = self.client.get("/api/reports/summary/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_report_summary_rejects_invalid_date_format(self):

        self.client.force_authenticate(user=self.agent)

        response = self.client.get(
            "/api/reports/summary/?start_date=not-a-date"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )


class ReportExcelExportSecurityTests(APITestCase):

    def setUp(self):

        self.agency = Agency.objects.create(name="آژانس تست")

        self.manager = User.objects.create_user(
            username="manager_1",
            password="StrongPass123",
            role="manager",
            agency=self.agency,
        )

        User.objects.create_user(
            username="agent_evil",
            password="StrongPass123",
            role="agent",
            agency=self.agency,
            first_name="=cmd|'/c calc'!A1",
        )

    def test_malicious_agent_name_is_sanitized_in_excel_export(self):

        self.client.force_authenticate(user=self.manager)

        response = self.client.get(
            "/api/reports/export/?export_format=excel"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        workbook = openpyxl.load_workbook(BytesIO(response.content))

        ws = workbook["عملکرد مشاوران"]

        agent_names = [
            row[0].value for row in ws.iter_rows(min_row=2)
        ]

        for name in agent_names:

            if name:
                self.assertFalse(
                    name.startswith(("=", "+", "-", "@"))
                )