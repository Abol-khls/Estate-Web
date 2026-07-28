from rest_framework.test import APITestCase
from rest_framework import status

from agencies.models import Agency
from users.models import User


class AgencyMeTests(APITestCase):

    def setUp(self):

        self.agency = Agency.objects.create(name="آژانس تست")

        self.manager = User.objects.create_user(
            username="manager_1",
            password="StrongPass123",
            role="manager",
            agency=self.agency,
        )

        self.agent = User.objects.create_user(
            username="agent_1",
            password="StrongPass123",
            role="agent",
            agency=self.agency,
        )

    def test_agent_cannot_edit_agency_profile(self):

        self.client.force_authenticate(user=self.agent)

        response = self.client.patch(
            "/api/agency/me/",
            {"name": "نام جدید"},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_manager_can_edit_agency_profile(self):

        self.client.force_authenticate(user=self.manager)

        response = self.client.patch(
            "/api/agency/me/",
            {"name": "نام جدید"},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.agency.refresh_from_db()

        self.assertEqual(self.agency.name, "نام جدید")