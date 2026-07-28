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