from rest_framework.test import APITestCase
from rest_framework import status

from agencies.models import Agency
from users.models import User
from customers.models import Customer


class CustomerAgencyIsolationTests(APITestCase):

    def setUp(self):

        self.agency_a = Agency.objects.create(name="آژانس الف")
        self.agency_b = Agency.objects.create(name="آژانس ب")

        self.agent_a = User.objects.create_user(
            username="agent_a",
            password="StrongPass123",
            role="agent",
            agency=self.agency_a,
        )

        self.customer_b = Customer.objects.create(
            full_name="مشتری آژانس ب",
            phone="09120000000",
            request_type="buy",
            agency=self.agency_b,
        )

    def test_agent_cannot_see_other_agency_customer(self):

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.get(
            f"/api/customers/{self.customer_b.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_created_customer_is_scoped_to_agent_own_agency(self):

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.post(
            "/api/customers/",
            {
                "full_name": "مشتری جدید",
                "phone": "09121111111",
                "request_type": "rent",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        created = Customer.objects.get(phone="09121111111")

        self.assertEqual(created.agency_id, self.agency_a.id)

    def test_duplicate_phone_in_same_agency_returns_validation_error(self):

        Customer.objects.create(
            full_name="مشتری اول",
            phone="09123334444",
            request_type="buy",
            agency=self.agency_a,
        )

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.post(
            "/api/customers/",
            {
                "full_name": "مشتری دوم با همان شماره",
                "phone": "09123334444",
                "request_type": "buy",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_customer_role_cannot_list_customers(self):

        customer_user = User.objects.create_user(
            username="customer_1",
            password="StrongPass123",
            role="customer",
            agency=self.agency_a,
        )

        self.client.force_authenticate(user=customer_user)

        response = self.client.get("/api/customers/")

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )