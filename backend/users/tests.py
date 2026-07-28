from rest_framework.test import APITestCase
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken

from agencies.models import Agency
from users.models import User


class TeamManagementPermissionTests(APITestCase):

    def setUp(self):

        self.agency_a = Agency.objects.create(name="آژانس الف")
        self.agency_b = Agency.objects.create(name="آژانس ب")

        self.manager_a = User.objects.create_user(
            username="manager_a",
            password="StrongPass123",
            role="manager",
            agency=self.agency_a,
        )

        self.agent_a = User.objects.create_user(
            username="agent_a",
            password="StrongPass123",
            role="agent",
            agency=self.agency_a,
        )

        self.manager_b = User.objects.create_user(
            username="manager_b",
            password="StrongPass123",
            role="manager",
            agency=self.agency_b,
        )

    def test_agent_cannot_access_team_endpoint(self):

        self.client.force_authenticate(user=self.agent_a)

        response = self.client.get("/api/team/")

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_manager_only_sees_own_agency_team(self):

        self.client.force_authenticate(user=self.manager_a)

        response = self.client.get("/api/team/")

        usernames = [item["username"] for item in response.data["results"]]

        self.assertIn("agent_a", usernames)
        self.assertNotIn("manager_b", usernames)

    def test_manager_cannot_deactivate_own_account(self):

        self.client.force_authenticate(user=self.manager_a)

        response = self.client.patch(
            f"/api/team/{self.manager_a.id}/",
            {"is_active": False},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_manager_cannot_delete_own_account(self):

        self.client.force_authenticate(user=self.manager_a)

        response = self.client.delete(
            f"/api/team/{self.manager_a.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )


class LoginThrottleTests(APITestCase):

    def setUp(self):

        self.agency = Agency.objects.create(name="آژانس تست")

        self.user = User.objects.create_user(
            username="throttle_user",
            password="StrongPass123",
            role="agent",
            agency=self.agency,
        )

    def test_repeated_failed_logins_are_throttled(self):

        last_response = None

        for _ in range(6):

            last_response = self.client.post(
                "/api/token/",
                {
                    "username": "throttle_user",
                    "password": "WrongPassword",
                },
            )

        self.assertEqual(
            last_response.status_code,
            status.HTTP_429_TOO_MANY_REQUESTS,
        )


class LogoutBlacklistTests(APITestCase):

    def setUp(self):

        self.agency = Agency.objects.create(name="آژانس تست")

        self.user = User.objects.create_user(
            username="logout_user",
            password="StrongPass123",
            role="agent",
            agency=self.agency,
        )

    def test_blacklisted_refresh_token_cannot_be_reused(self):

        refresh = RefreshToken.for_user(self.user)

        blacklist_response = self.client.post(
            "/api/token/blacklist/",
            {"refresh": str(refresh)},
        )

        self.assertEqual(
            blacklist_response.status_code,
            status.HTTP_200_OK,
        )

        refresh_response = self.client.post(
            "/api/token/refresh/",
            {"refresh": str(refresh)},
        )

        self.assertEqual(
            refresh_response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )


class SchemaAccessTests(APITestCase):

    def setUp(self):

        self.agency = Agency.objects.create(name="آژانس تست")

        self.agent = User.objects.create_user(
            username="agent_1",
            password="StrongPass123",
            role="agent",
            agency=self.agency,
        )

        self.staff_user = User.objects.create_user(
            username="staff_1",
            password="StrongPass123",
            role="manager",
            agency=self.agency,
            is_staff=True,
        )

    def test_anonymous_user_cannot_access_schema(self):

        response = self.client.get("/api/schema/")

        self.assertEqual(
            response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_non_staff_agent_cannot_access_schema(self):

        self.client.force_authenticate(user=self.agent)

        response = self.client.get("/api/schema/")

        self.assertEqual(
            response.status_code,
            status.HTTP_403_FORBIDDEN,
        )

    def test_staff_user_can_access_schema(self):

        self.client.force_authenticate(user=self.staff_user)

        response = self.client.get("/api/schema/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )