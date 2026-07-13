from rest_framework.permissions import BasePermission, SAFE_METHODS


class IsManager(BasePermission):

    def has_permission(self, request, view):

        return (
            request.user.is_authenticated
            and request.user.role == 'manager'
        )


class IsAgentOrManager(BasePermission):

    def has_permission(self, request, view):

        if not request.user.is_authenticated:
            return False

        if request.method in SAFE_METHODS:
            return True

        return request.user.role in ('manager', 'agent')