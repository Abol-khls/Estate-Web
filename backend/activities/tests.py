from rest_framework.test import APITestCase
from rest_framework import status

from agencies.models import Agency
from users.models import User
from customers.models import Customer
from activities.models import Activity


class ActivityAgencyIsolationTests(APITestCase):

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

    def test_cannot_create_activity_for_other_agency_customer(self):

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.post(
            "/api/activities/",
            {
                "customer": self.customer_b.id,
                "title": "تماس پیگیری",
                "follow_date": "2026-08-01T10:00:00Z",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_activity_user_is_set_to_authenticated_agent(self):

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.post(
            "/api/activities/",
            {
                "customer": self.customer_a.id,
                "title": "تماس پیگیری",
                "follow_date": "2026-08-01T10:00:00Z",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        created = Activity.objects.get(id=response.data["id"])

        self.assertEqual(created.user_id, self.agent_a.id)