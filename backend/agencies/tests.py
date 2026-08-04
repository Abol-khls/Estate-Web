from io import StringIO

from django.core.management import call_command
from django.core.management.base import CommandError
from django.test import TestCase, RequestFactory

from rest_framework.test import APITestCase
from rest_framework import status

from agencies.models import Agency
from agencies.admin import AgencyAdmin
from django.contrib.admin.sites import AdminSite
from users.models import User


class AgencyAdminSingleTenantTests(TestCase):

    def setUp(self):

        self.factory = RequestFactory()

        self.admin_instance = AgencyAdmin(Agency, AdminSite())

    def test_add_permission_allowed_when_no_agency_exists(self):

        request = self.factory.get("/admin/agencies/agency/add/")

        request.user = User.objects.create_superuser(
            username="admin_user",
            password="StrongPass123",
        )

        self.assertTrue(
            self.admin_instance.has_add_permission(request)
        )

    def test_add_permission_denied_when_agency_already_exists(self):

        Agency.objects.create(name="آژانس موجود")

        request = self.factory.get("/admin/agencies/agency/add/")

        self.assertFalse(
            self.admin_instance.has_add_permission(request)
        )


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

    def test_command_rejects_second_agency_without_force(self):

        call_command(
            "create_agency_owner",
            "--agency-name=املاک اول",
            "--username=owner_3",
            "--password=StrongPass123",
        )

        with self.assertRaises(CommandError):

            call_command(
                "create_agency_owner",
                "--agency-name=املاک دوم",
                "--username=owner_4",
                "--password=StrongPass123",
            )

        self.assertEqual(Agency.objects.count(), 1)

    def test_command_allows_second_agency_with_force(self):

        call_command(
            "create_agency_owner",
            "--agency-name=املاک اول",
            "--username=owner_5",
            "--password=StrongPass123",
        )

        call_command(
            "create_agency_owner",
            "--agency-name=املاک دوم",
            "--username=owner_6",
            "--password=StrongPass123",
            "--force",
        )

        self.assertEqual(Agency.objects.count(), 2)


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