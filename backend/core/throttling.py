from rest_framework.throttling import AnonRateThrottle, SimpleRateThrottle


class LoginIPRateThrottle(AnonRateThrottle):

    scope = 'login_ip'


class LoginUsernameRateThrottle(SimpleRateThrottle):

    scope = 'login_username'

    def get_cache_key(self, request, view):

        username = str(request.data.get('username', '')).strip().lower()

        if not username:
            return None

        return self.cache_format % {
            'scope': self.scope,
            'ident': username,
        }