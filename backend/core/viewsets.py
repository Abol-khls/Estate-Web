from rest_framework.viewsets import ModelViewSet


class AgencyScopedViewSet(ModelViewSet):

    def get_queryset(self):
        user = self.request.user

        if not user.agency:
            return self.queryset.none()

        return self.queryset.filter(
            agency=user.agency
        )

    def perform_create(self, serializer):
        serializer.save(
            agency=self.request.user.agency
        )