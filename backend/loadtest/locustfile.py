import os
import random

from locust import HttpUser, task, between

AGENT_USERNAME = os.environ.get("LOAD_TEST_USERNAME", "")
AGENT_PASSWORD = os.environ.get("LOAD_TEST_PASSWORD", "")


class PublicVisitor(HttpUser):

    weight = 5

    wait_time = between(1, 3)

    @task(5)
    def browse_properties(self):

        self.client.get(
            "/api/public/properties/?page=1",
            name="/api/public/properties/",
        )

    @task(3)
    def view_property_detail(self):

        response = self.client.get(
            "/api/public/properties/?page=1",
            name="/api/public/properties/",
        )

        results = response.json().get("results", [])

        if results:

            property_id = random.choice(results)["id"]

            self.client.get(
                f"/api/public/properties/{property_id}/",
                name="/api/public/properties/[id]/",
            )

    @task(2)
    def view_agency_info(self):

        self.client.get(
            "/api/public/agency/",
            name="/api/public/agency/",
        )

    @task(1)
    def submit_inquiry(self):

        self.client.post(
            "/api/public/inquiries/",
            json={
                "full_name": "Load Test User",
                "phone": f"0912{random.randint(1000000, 9999999)}",
                "message": "Load test inquiry",
                "request_type": "call",
            },
            name="/api/public/inquiries/",
        )


class AdminAgent(HttpUser):

    weight = 1

    wait_time = between(2, 5)

    def on_start(self):

        if not AGENT_USERNAME or not AGENT_PASSWORD:
            self.access_token = None
            return

        response = self.client.post(
            "/api/token/",
            json={
                "username": AGENT_USERNAME,
                "password": AGENT_PASSWORD,
            },
            name="/api/token/",
        )

        if response.status_code == 200:
            self.access_token = response.json().get("access")
        else:
            self.access_token = None

    @property
    def auth_headers(self):

        if not self.access_token:
            return {}

        return {"Authorization": f"Bearer {self.access_token}"}

    @task(4)
    def list_properties(self):

        self.client.get(
            "/api/properties/?page=1",
            headers=self.auth_headers,
            name="/api/properties/",
        )

    @task(2)
    def list_customers(self):

        self.client.get(
            "/api/customers/?page=1",
            headers=self.auth_headers,
            name="/api/customers/",
        )

    @task(2)
    def view_dashboard(self):

        self.client.get(
            "/api/dashboard/",
            headers=self.auth_headers,
            name="/api/dashboard/",
        )

    @task(1)
    def view_me(self):

        self.client.get(
            "/api/me/",
            headers=self.auth_headers,
            name="/api/me/",
        )