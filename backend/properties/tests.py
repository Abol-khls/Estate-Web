from rest_framework.test import APITestCase
from rest_framework import status

from agencies.models import Agency
from users.models import User
from properties.models import Property


class PropertyAgencyIsolationTests(APITestCase):

    def setUp(self):

        self.agency_a = Agency.objects.create(name="آژانس الف")
        self.agency_b = Agency.objects.create(name="آژانس ب")

        self.agent_a = User.objects.create_user(
            username="agent_a",
            password="StrongPass123",
            role="agent",
            agency=self.agency_a,
        )

        self.agent_b = User.objects.create_user(
            username="agent_b",
            password="StrongPass123",
            role="agent",
            agency=self.agency_b,
        )

        self.property_a = Property.objects.create(
            code="A-1",
            title="ملک آژانس الف",
            property_type="apartment",
            transaction_type="sale",
            price=1000000,
            area=100,
            address="تهران",
            agency=self.agency_a,
        )

        self.property_b = Property.objects.create(
            code="B-1",
            title="ملک آژانس ب",
            property_type="apartment",
            transaction_type="sale",
            price=2000000,
            area=120,
            address="تهران",
            agency=self.agency_b,
        )

    def test_list_requires_authentication(self):

        response = self.client.get("/api/properties/")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_agent_only_sees_properties_from_own_agency(self):

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.get("/api/properties/")

        codes = [item["code"] for item in response.data["results"]]

        self.assertIn("A-1", codes)
        self.assertNotIn("B-1", codes)

    def test_agent_cannot_retrieve_other_agency_property(self):

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.get(
            f"/api/properties/{self.property_b.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_created_property_is_scoped_to_agent_own_agency(self):

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.post(
            "/api/properties/",
            {
                "code": "A-2",
                "title": "ملک جدید",
                "property_type": "villa",
                "transaction_type": "rent",
                "price": 500000,
                "area": 80,
                "address": "کرج",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        created = Property.objects.get(code="A-2")

        self.assertEqual(created.agency_id, self.agency_a.id)

    def test_authenticated_customer_role_can_currently_list_properties(self):

        customer_user = User.objects.create_user(
            username="customer_1",
            password="StrongPass123",
            role="customer",
            agency=self.agency_a,
        )

        self.client.force_authenticate(user=customer_user)

        response = self.client.get("/api/properties/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_customer_role_cannot_create_property(self):

        customer_user = User.objects.create_user(
            username="customer_2",
            password="StrongPass123",
            role="customer",
            agency=self.agency_a,
        )

        self.client.force_authenticate(user=customer_user)

        response = self.client.post(
            "/api/properties/",
            {
                "code": "A-3",
                "title": "ملک جدید",
                "property_type": "villa",
                "transaction_type": "rent",
                "price": 500000,
                "area": 80,
                "address": "کرج",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )