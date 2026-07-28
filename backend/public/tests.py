from rest_framework.test import APITestCase
from rest_framework import status

from agencies.models import Agency
from properties.models import Property


class PublicPropertyTests(APITestCase):

    def setUp(self):

        self.agency = Agency.objects.create(name="آژانس تست")

        self.available_property = Property.objects.create(
            code="A-1",
            title="ملک قابل نمایش",
            property_type="apartment",
            transaction_type="sale",
            price=1000000,
            area=100,
            address="تهران",
            agency=self.agency,
            status="available",
        )

        self.sold_property = Property.objects.create(
            code="A-2",
            title="ملک فروخته‌شده",
            property_type="apartment",
            transaction_type="sale",
            price=1000000,
            area=100,
            address="تهران",
            agency=self.agency,
            status="sold",
        )

    def test_public_can_list_available_properties_without_auth(self):

        response = self.client.get("/api/public/properties/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        titles = [item["title"] for item in response.data["results"]]

        self.assertIn("ملک قابل نمایش", titles)
        self.assertNotIn("ملک فروخته‌شده", titles)


class PublicInquiryThrottleTests(APITestCase):

    def setUp(self):

        Agency.objects.create(name="آژانس تست")

    def test_inquiry_submissions_are_throttled(self):

        last_response = None

        for _ in range(6):

            last_response = self.client.post(
                "/api/public/inquiries/",
                {
                    "full_name": "کاربر تست",
                    "phone": "09121234567",
                    "message": "سلام، این ملک هنوز موجود است؟",
                },
            )

        self.assertEqual(
            last_response.status_code,
            status.HTTP_429_TOO_MANY_REQUESTS,
        )