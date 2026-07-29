from django.test.utils import CaptureQueriesContext
from django.db import connection

from rest_framework.test import APITestCase
from rest_framework import status

from agencies.models import Agency
from users.models import User
from properties.models import Property, PropertyImage


class PropertyListPerformanceTests(APITestCase):

    def setUp(self):

        self.agency = Agency.objects.create(name="آژانس تست")

        self.agent = User.objects.create_user(
            username="agent_perf",
            password="StrongPass123",
            role="agent",
            agency=self.agency,
        )

        for index in range(15):

            property_obj = Property.objects.create(
                code=f"P-{index}",
                title=f"ملک شماره {index}",
                property_type="apartment",
                transaction_type="sale",
                price=1000000,
                area=100,
                address="تهران",
                agency=self.agency,
            )

            PropertyImage.objects.create(
                property=property_obj,
                image="properties/fake.jpg",
                is_cover=True,
            )

    def test_property_list_query_count_does_not_scale_with_row_count(self):

        self.client.force_authenticate(user=self.agent)

        with CaptureQueriesContext(connection) as first_batch:
            self.client.get("/api/properties/")

        for index in range(15, 30):

            property_obj = Property.objects.create(
                code=f"P-{index}",
                title=f"ملک شماره {index}",
                property_type="apartment",
                transaction_type="sale",
                price=1000000,
                area=100,
                address="تهران",
                agency=self.agency,
            )

            PropertyImage.objects.create(
                property=property_obj,
                image="properties/fake.jpg",
                is_cover=True,
            )

        with CaptureQueriesContext(connection) as second_batch:
            self.client.get("/api/properties/")

        self.assertEqual(
            len(first_batch.captured_queries),
            len(second_batch.captured_queries),
        )

        self.assertLess(
            len(second_batch.captured_queries),
            15,
        )


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

    def test_duplicate_code_in_same_agency_returns_validation_error(self):

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.post(
            "/api/properties/",
            {
                "code": "A-1",
                "title": "ملک دوم با کد تکراری",
                "property_type": "villa",
                "transaction_type": "rent",
                "price": 500000,
                "area": 80,
                "address": "کرج",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_customer_role_cannot_list_properties(self):

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
            status.HTTP_403_FORBIDDEN,
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