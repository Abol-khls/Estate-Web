import os
import random
import string

from locust import HttpUser, task, between, LoadTestShape

AGENT_USERNAME = os.environ.get("LOAD_TEST_USERNAME", "")
AGENT_PASSWORD = os.environ.get("LOAD_TEST_PASSWORD", "")


def random_code():

    return "STRESS-" + "".join(
        random.choices(string.ascii_uppercase + string.digits, k=8)
    )


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

        try:
            results = response.json().get("results", [])
        except ValueError:
            results = []

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
                "full_name": "Stress Test User",
                "phone": f"0912{random.randint(1000000, 9999999)}",
                "message": "Stress test inquiry",
                "request_type": "call",
            },
            name="/api/public/inquiries/",
        )


class AdminAgent(HttpUser):

    weight = 1

    wait_time = between(1, 3)

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

    @task(6)
    def list_properties(self):

        self.client.get(
            "/api/properties/?page=1",
            headers=self.auth_headers,
            name="/api/properties/",
        )

    @task(2)
    def view_property_detail(self):

        response = self.client.get(
            "/api/properties/?page=1",
            headers=self.auth_headers,
            name="/api/properties/",
        )

        try:
            results = response.json().get("results", [])
        except ValueError:
            results = []

        if results:

            property_id = random.choice(results)["id"]

            self.client.get(
                f"/api/properties/{property_id}/",
                headers=self.auth_headers,
                name="/api/properties/[id]/",
            )

    @task(2)
    def create_property(self):

        self.client.post(
            "/api/properties/",
            headers=self.auth_headers,
            json={
                "code": random_code(),
                "title": "ملک تست فشار",
                "property_type": "apartment",
                "transaction_type": "sale",
                "price": 1000000000,
                "area": 100,
                "rooms": 2,
                "address": "تهران",
            },
            name="/api/properties/ [POST]",
        )

    @task(3)
    def list_customers(self):

        self.client.get(
            "/api/customers/?page=1",
            headers=self.auth_headers,
            name="/api/customers/",
        )

    @task(3)
    def list_visits(self):

        self.client.get(
            "/api/visits/?page=1",
            headers=self.auth_headers,
            name="/api/visits/",
        )

    @task(3)
    def list_contracts(self):

        self.client.get(
            "/api/contracts/?page=1",
            headers=self.auth_headers,
            name="/api/contracts/",
        )

    @task(3)
    def list_activities(self):

        self.client.get(
            "/api/activities/?page=1",
            headers=self.auth_headers,
            name="/api/activities/",
        )

    @task(3)
    def view_dashboard(self):

        self.client.get(
            "/api/dashboard/",
            headers=self.auth_headers,
            name="/api/dashboard/",
        )

    @task(2)
    def view_reports_summary(self):

        self.client.get(
            "/api/reports/summary/",
            headers=self.auth_headers,
            name="/api/reports/summary/",
        )

    @task(1)
    def view_me(self):

        self.client.get(
            "/api/me/",
            headers=self.auth_headers,
            name="/api/me/",
        )

    @task(1)
    def refresh_token(self):

        self.client.post(
            "/api/token/refresh/",
            name="/api/token/refresh/",
        )


class StressTestShape(LoadTestShape):

    stages = [
        {"duration": 30, "users": 20, "spawn_rate": 5},
        {"duration": 60, "users": 50, "spawn_rate": 10},
        {"duration": 90, "users": 100, "spawn_rate": 15},
        {"duration": 120, "users": 200, "spawn_rate": 20},
        {"duration": 150, "users": 400, "spawn_rate": 25},
        {"duration": 180, "users": 600, "spawn_rate": 30},
    ]

    def tick(self):

        run_time = self.get_run_time()

        for stage in self.stages:

            if run_time < stage["duration"]:
                return (stage["users"], stage["spawn_rate"])

        return None