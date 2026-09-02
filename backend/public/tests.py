from django.core.cache import cache

from rest_framework.test import APITestCase
from rest_framework import status

from agencies.models import Agency
from properties.models import Property
from customers.models import Customer


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

    def test_public_can_view_available_property_detail(self):

        response = self.client.get(
            f"/api/public/properties/{self.available_property.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(
            response.data["title"],
            "ملک قابل نمایش",
        )

    def test_public_cannot_view_sold_property_detail(self):

        response = self.client.get(
            f"/api/public/properties/{self.sold_property.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_404_NOT_FOUND,
        )


class PublicAgencyTests(APITestCase):

    def setUp(self):

        cache.clear()

    def test_public_agency_returns_name_phone_and_address(self):

        Agency.objects.create(
            name="آژانس تست",
            phone="02112345678",
            address="تهران، خیابان آزمایشی",
        )

        response = self.client.get("/api/public/agency/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(response.data["name"], "آژانس تست")
        self.assertEqual(response.data["phone"], "02112345678")
        self.assertEqual(response.data["address"], "تهران، خیابان آزمایشی")

    def test_public_agency_returns_empty_object_when_no_agency_exists(self):

        response = self.client.get("/api/public/agency/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertEqual(response.data, {})


class PublicInquiryTests(APITestCase):

    def setUp(self):

        self.agency = Agency.objects.create(name="آژانس تست")

    def test_inquiry_submission_creates_customer(self):

        response = self.client.post(
            "/api/public/inquiries/",
            {
                "full_name": "کاربر تست",
                "phone": "09121234567",
                "message": "سلام، این ملک هنوز موجود است؟",
                "request_type": "call",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertTrue(
            Customer.objects.filter(
                agency=self.agency,
                phone="09121234567",
            ).exists()
        )

    def test_repeat_inquiry_reuses_existing_customer_by_phone(self):

        self.client.post(
            "/api/public/inquiries/",
            {
                "full_name": "کاربر تست",
                "phone": "09121234567",
                "message": "درخواست اول",
            },
        )

        self.client.post(
            "/api/public/inquiries/",
            {
                "full_name": "کاربر تست",
                "phone": "09121234567",
                "message": "درخواست دوم",
            },
        )

        self.assertEqual(
            Customer.objects.filter(
                agency=self.agency,
                phone="09121234567",
            ).count(),
            1,
        )

    def test_inquiry_without_required_phone_is_rejected(self):

        response = self.client.post(
            "/api/public/inquiries/",
            {
                "full_name": "کاربر تست",
                "message": "بدون شماره تماس",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )


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