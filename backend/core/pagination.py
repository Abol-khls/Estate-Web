from rest_framework.pagination import PageNumberPagination


class TwentyPerPagePagination(PageNumberPagination):

    page_size = 20