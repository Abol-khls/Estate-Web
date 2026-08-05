from rest_framework.test import APITestCase
from rest_framework import status

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


class LastManagerGuardTests(APITestCase):

    def setUp(self):

        self.agency = Agency.objects.create(name="آژانس تست")

        self.manager = User.objects.create_user(
            username="only_manager",
            password="StrongPass123",
            role="manager",
            agency=self.agency,
        )

        self.other_manager = User.objects.create_user(
            username="second_manager",
            password="StrongPass123",
            role="manager",
            agency=self.agency,
        )

    def test_cannot_demote_the_last_manager(self):

        self.client.force_authenticate(user=self.manager)

        self.client.patch(
            f"/api/team/{self.other_manager.id}/",
            {"role": "agent"},
        )

        response = self.client.patch(
            f"/api/team/{self.manager.id}/",
            {"role": "agent"},
        )

        self.manager.refresh_from_db()

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertEqual(self.manager.role, "manager")

    def test_cannot_deactivate_the_last_active_manager(self):

        self.client.force_authenticate(user=self.other_manager)

        self.client.patch(
            f"/api/team/{self.manager.id}/",
            {"is_active": False},
        )

        response = self.client.patch(
            f"/api/team/{self.other_manager.id}/",
            {"is_active": False},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_cannot_change_role_of_the_last_manager(self):

        self.client.force_authenticate(user=self.manager)

        self.client.patch(
            f"/api/team/{self.other_manager.id}/",
            {"is_active": False},
        )

        response = self.client.patch(
            f"/api/team/{self.manager.id}/",
            {"role": "agent"},
        )

        self.manager.refresh_from_db()

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertEqual(self.manager.role, "manager")

    def test_cannot_delete_the_last_manager(self):

        self.client.force_authenticate(user=self.manager)

        self.client.patch(
            f"/api/team/{self.other_manager.id}/",
            {"is_active": False},
        )

        self.client.force_authenticate(user=self.other_manager)

        response = self.client.delete(
            f"/api/team/{self.manager.id}/"
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertTrue(
            User.objects.filter(id=self.manager.id).exists()
        )

    def test_can_demote_a_manager_when_another_active_manager_remains(self):

        self.client.force_authenticate(user=self.manager)

        response = self.client.patch(
            f"/api/team/{self.other_manager.id}/",
            {"role": "agent"},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )


class SingleManagerCeilingTests(APITestCase):

    def setUp(self):

        self.agency = Agency.objects.create(name="آژانس تست")

        self.manager = User.objects.create_user(
            username="only_manager",
            password="StrongPass123",
            role="manager",
            agency=self.agency,
        )

        self.agent = User.objects.create_user(
            username="an_agent",
            password="StrongPass123",
            role="agent",
            agency=self.agency,
        )

    def test_creating_new_team_members_is_disabled(self):

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            "/api/team/",
            {
                "username": "new_manager",
                "password": "StrongPass123",
                "role": "manager",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
        )

        self.assertFalse(
            User.objects.filter(username="new_manager").exists()
        )

    def test_cannot_promote_an_agent_to_manager(self):

        self.client.force_authenticate(user=self.manager)

        response = self.client.patch(
            f"/api/team/{self.agent.id}/",
            {"role": "manager"},
        )

        self.agent.refresh_from_db()

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

        self.assertEqual(self.agent.role, "agent")

    def test_editing_the_current_manager_without_changing_role_still_works(self):

        self.client.force_authenticate(user=self.manager)

        response = self.client.patch(
            f"/api/team/{self.manager.id}/",
            {"role": "manager", "phone": "09120000000"},
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

    def test_creating_a_replacement_manager_is_also_disabled(self):

        self.manager.is_active = False
        self.manager.save()

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            "/api/team/",
            {
                "username": "replacement_manager",
                "password": "StrongPass123",
                "role": "manager",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_405_METHOD_NOT_ALLOWED,
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

    def test_login_sets_httponly_refresh_cookie(self):

        response = self.client.post(
            "/api/token/",
            {
                "username": "logout_user",
                "password": "StrongPass123",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertNotIn("refresh", response.data)

        cookie = response.cookies.get("refresh_token")

        self.assertIsNotNone(cookie)

        self.assertTrue(cookie["httponly"])

    def test_refresh_reads_token_from_cookie(self):

        self.client.post(
            "/api/token/",
            {
                "username": "logout_user",
                "password": "StrongPass123",
            },
        )

        response = self.client.post("/api/token/refresh/")

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.assertIn("access", response.data)

    def test_logout_blacklists_the_cookie_refresh_token(self):

        self.client.post(
            "/api/token/",
            {
                "username": "logout_user",
                "password": "StrongPass123",
            },
        )

        logout_response = self.client.post("/api/token/logout/")

        self.assertEqual(
            logout_response.status_code,
            status.HTTP_200_OK,
        )

        refresh_response = self.client.post("/api/token/refresh/")

        self.assertEqual(
            refresh_response.status_code,
            status.HTTP_401_UNAUTHORIZED,
        )

    def test_refresh_without_cookie_is_rejected(self):

        response = self.client.post("/api/token/refresh/")

        self.assertEqual(
            response.status_code,
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


class PasswordPolicyTests(APITestCase):

    def setUp(self):

        self.agency = Agency.objects.create(name="آژانس تست")

        self.manager = User.objects.create_user(
            username="policy_manager",
            password="StrongPass123",
            role="manager",
            agency=self.agency,
        )

    def test_change_password_rejects_password_without_uppercase(self):

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            "/api/me/change-password/",
            {
                "old_password": "StrongPass123",
                "new_password": "lowercase123",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_change_password_rejects_password_without_digit(self):

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            "/api/me/change-password/",
            {
                "old_password": "StrongPass123",
                "new_password": "NoDigitsHere",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_change_password_rejects_short_password(self):

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            "/api/me/change-password/",
            {
                "old_password": "StrongPass123",
                "new_password": "Ab1",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_400_BAD_REQUEST,
        )

    def test_change_password_accepts_a_compliant_password(self):

        self.client.force_authenticate(user=self.manager)

        response = self.client.post(
            "/api/me/change-password/",
            {
                "old_password": "StrongPass123",
                "new_password": "AnotherGood456",
            },
        )

        self.assertEqual(
            response.status_code,
            status.HTTP_200_OK,
        )

        self.manager.refresh_from_db()

        self.assertTrue(
            self.manager.check_password("AnotherGood456")
        )