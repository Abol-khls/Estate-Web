from rest_framework.test import APITestCase
from rest_framework import status

from agencies.models import Agency
from users.models import User
from properties.models import Property


class DashboardTests(APITestCase):

    def setUp(self):

        self.agency_a = Agency.objects.create(name="آژانس الف")
        self.agency_b = Agency.objects.create(name="آژانس ب")

        self.agent_a = User.objects.create_user(
            username="agent_a",
            password="StrongPass123",
            role="agent",
            agency=self.agency_a,
        )

        Property.objects.create(
            code="A-1",
            title="ملک الف",
            property_type="apartment",
            transaction_type="sale",
            price=1000000,
            area=100,
            address="تهران",
            agency=self.agency_a,
        )

        Property.objects.create(
            code="B-1",
            title="ملک ب",
            property_type="apartment",
            transaction_type="sale",
            price=1000000,
            area=100,
            address="تهران",
            agency=self.agency_b,
        )

    def test_dashboard_requires_authentication(self):

        response = self.client.get("/api/dashboard/")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_dashboard_counts_are_scoped_to_own_agency(self):

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.get("/api/dashboard/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data["properties_count"],
            1,
        )