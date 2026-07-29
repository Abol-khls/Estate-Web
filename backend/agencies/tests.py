from io import StringIO

from django.core.management import call_command
from django.core.management.base import CommandError

from rest_framework.test import APITestCase
from rest_framework import status

from agencies.models import Agency
from users.models import User


class CreateAgencyOwnerCommandTests(APITestCase):

    def test_command_creates_agency_and_manager(self):

        out = StringIO()

        call_command(
            "create_agency_owner",
            "--agency-name=املاک تست",
            "--username=owner_1",
            "--password=StrongPass123",
            stdout=out,
        )

        agency = Agency.objects.get(name="املاک تست")

        owner = User.objects.get(username="owner_1")

        self.assertEqual(owner.role, "manager")
        self.assertEqual(owner.agency_id, agency.id)
        self.assertTrue(owner.is_superuser)

    def test_command_rejects_duplicate_username(self):

        User.objects.create_user(
            username="owner_2",
            password="StrongPass123",
            role="manager",
        )

        with self.assertRaises(CommandError):

            call_command(
                "create_agency_owner",
                "--agency-name=املاک دوم",
                "--username=owner_2",
                "--password=StrongPass123",
            )


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