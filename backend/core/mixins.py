from audit.request_context import set_current_actor, clear_current_actor


class AuditActorMixin:

    def initial(self, request, *args, **kwargs):

        super().initial(request, *args, **kwargs)

        set_current_actor(
            request.user if request.user.is_authenticated else None
        )

    def finalize_response(self, request, response, *args, **kwargs):

        response = super().finalize_response(request, response, *args, **kwargs)

        clear_current_actor()

        return response