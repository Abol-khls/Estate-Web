import re

from django.core.exceptions import ValidationError


class ComplexityValidator:

    def validate(self, password, user=None):

        if not re.search(r'[A-Z]', password):
            raise ValidationError(
                "رمز عبور باید حداقل شامل یک حرف بزرگ انگلیسی باشد.",
                code='password_no_upper',
            )

        if not re.search(r'[a-z]', password):
            raise ValidationError(
                "رمز عبور باید حداقل شامل یک حرف کوچک انگلیسی باشد.",
                code='password_no_lower',
            )

        if not re.search(r'\d', password):
            raise ValidationError(
                "رمز عبور باید حداقل شامل یک عدد باشد.",
                code='password_no_digit',
            )

    def get_help_text(self):

        return "رمز عبور باید شامل حداقل یک حرف بزرگ، یک حرف کوچک انگلیسی و یک عدد باشد."


class MaximumLengthValidator:

    def __init__(self, max_length=64):

        self.max_length = max_length

    def validate(self, password, user=None):

        if len(password) > self.max_length:
            raise ValidationError(
                "رمز عبور نباید بیشتر از %(max_length)d کاراکتر باشد.",
                code='password_too_long',
                params={'max_length': self.max_length},
            )

    def get_help_text(self):

        return "رمز عبور نباید بیشتر از %(max_length)d کاراکتر باشد." % {
            'max_length': self.max_length
        }