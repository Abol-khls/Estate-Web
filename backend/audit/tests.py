from rest_framework.test import APITestCase
from rest_framework import status

from agencies.models import Agency
from users.models import User
from audit.models import AuditLog


class AuditLogTests(APITestCase):

    def setUp(self):

        self.agency = Agency.objects.create(name="آژانس تست")

        self.agent = User.objects.create_user(
            username="agent_1",
            password="StrongPass123",
            role="agent",
            agency=self.agency,
        )

    def test_creating_a_property_writes_an_audit_log_entry(self):

        self.client.force_authenticate(user=self.agent)

        response = self.client.post(
            "/api/properties/",
            {
                "code": "A-1",
                "title": "ملک تست",
                "property_type": "apartment",
                "transaction_type": "sale",
                "price": 1000000,
                "area": 100,
                "address": "تهران",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_201_CREATED,
        )

        log_entry = AuditLog.objects.filter(
            model_name="property",
            action="create",
        ).first()

        self.assertIsNotNone(log_entry)

        self.assertEqual(log_entry.actor_id, self.agent.id)

        self.assertEqual(log_entry.agency_id, self.agency.id)

    def test_deleting_a_property_writes_an_audit_log_entry(self):

        self.client.force_authenticate(user=self.agent)

        create_response = self.client.post(
            "/api/properties/",
            {
                "code": "A-2",
                "title": "ملک تست حذف",
                "property_type": "apartment",
                "transaction_type": "sale",
                "price": 1000000,
                "area": 100,
                "address": "تهران",
            },
        )

        property_id = create_response.data["id"]

        self.client.delete(f"/api/properties/{property_id}/")

        log_entry = AuditLog.objects.filter(
            model_name="property",
            object_id=str(property_id),
            action="delete",
        ).first()

        self.assertIsNotNone(log_entry)

        self.assertEqual(log_entry.actor_id, self.agent.id)