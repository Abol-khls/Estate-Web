from django.test.utils import CaptureQueriesContext
from django.db import connection

from rest_framework.test import APITestCase
from rest_framework import status

from agencies.models import Agency
from users.models import User
from customers.models import Customer
from properties.models import Property
from visits.models import Visit


class VisitAgencyIsolationTests(APITestCase):

    def setUp(self):

        self.agency_a = Agency.objects.create(name="آژانس الف")
        self.agency_b = Agency.objects.create(name="آژانس ب")

        self.agent_a = User.objects.create_user(
            username="agent_a",
            password="StrongPass123",
            role="agent",
            agency=self.agency_a,
        )

        self.customer_a = Customer.objects.create(
            full_name="مشتری الف",
            phone="09121112233",
            request_type="buy",
            agency=self.agency_a,
        )

        self.customer_b = Customer.objects.create(
            full_name="مشتری ب",
            phone="09124445566",
            request_type="buy",
            agency=self.agency_b,
        )

        self.property_a = Property.objects.create(
            code="A-1",
            title="ملک الف",
            property_type="apartment",
            transaction_type="sale",
            price=1000000,
            area=100,
            address="تهران",
            agency=self.agency_a,
        )

        self.property_b = Property.objects.create(
            code="B-1",
            title="ملک ب",
            property_type="apartment",
            transaction_type="sale",
            price=2000000,
            area=120,
            address="تهران",
            agency=self.agency_b,
        )

        self.visit_b = Visit.objects.create(
            customer=self.customer_b,
            property=self.property_b,
            visit_date="2026-08-01T10:00:00Z",
            agency=self.agency_b,
        )

    def test_agent_cannot_see_other_agency_visit(self):

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.get(
            f"/api/visits/{self.visit_b.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_cannot_create_visit_with_other_agency_property(self):

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.post(
            "/api/visits/",
            {
                "customer": self.customer_a.id,
                "property": self.property_b.id,
                "visit_date": "2026-08-01T10:00:00Z",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_agent_can_create_visit_within_own_agency(self):

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.post(
            "/api/visits/",
            {
                "customer": self.customer_a.id,
                "property": self.property_a.id,
                "visit_date": "2026-08-01T10:00:00Z",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

    def test_visit_list_query_count_does_not_scale_with_row_count(self):

        self.client.force_authenticate(user=self.agent_a)

        for index in range(10):

            Visit.objects.create(
                customer=self.customer_a,
                property=self.property_a,
                visit_date="2026-08-01T10:00:00Z",
                agency=self.agency_a,
                agent=self.agent_a,
            )

        with CaptureQueriesContext(connection) as queries:
            self.client.get("/api/visits/")

        self.assertLess(len(queries.captured_queries), 10)