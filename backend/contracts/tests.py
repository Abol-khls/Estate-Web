from django.test.utils import CaptureQueriesContext
from django.db import connection

from rest_framework.test import APITestCase
from rest_framework import status

from agencies.models import Agency
from users.models import User
from customers.models import Customer
from properties.models import Property
from contracts.models import Contract


class ContractAgencyIsolationTests(APITestCase):

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

        self.contract_b = Contract.objects.create(
            customer=self.customer_b,
            property=self.property_a,
            contract_type="sale",
            amount=1000000,
            agency=self.agency_b,
        )

    def test_agent_cannot_see_other_agency_contract(self):

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.get(
            f"/api/contracts/{self.contract_b.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )

    def test_created_contract_agent_is_the_authenticated_user(self):

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.post(
            "/api/contracts/",
            {
                "customer": self.customer_a.id,
                "property": self.property_a.id,
                "contract_type": "sale",
                "amount": 3000000,
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        created = Contract.objects.get(id=response.data["id"])

        self.assertEqual(created.agent_id, self.agent_a.id)

    def test_contract_agent_is_not_reassigned_on_update(self):

        self.client.force_authenticate(user=self.agent_a)

        create_response = self.client.post(
            "/api/contracts/",
            {
                "customer": self.customer_a.id,
                "property": self.property_a.id,
                "contract_type": "sale",
                "amount": 3000000,
            },
        )

        contract_id = create_response.data["id"]

        other_agent = User.objects.create_user(
            username="agent_a2",
            password="StrongPass123",
            role="agent",
            agency=self.agency_a,
        )

        self.client.force_authenticate(user=other_agent)

        self.client.patch(
            f"/api/contracts/{contract_id}/",
            {"amount": 3500000},
        )

        updated = Contract.objects.get(id=contract_id)

        self.assertEqual(updated.agent_id, self.agent_a.id)

    def test_contract_list_query_count_does_not_scale_with_row_count(self):

        self.client.force_authenticate(user=self.agent_a)

        for index in range(10):

            Contract.objects.create(
                customer=self.customer_a,
                property=self.property_a,
                contract_type="sale",
                amount=1000000,
                agency=self.agency_a,
                agent=self.agent_a,
            )

        with CaptureQueriesContext(connection) as queries:
            self.client.get("/api/contracts/")

        self.assertLess(len(queries.captured_queries), 10)