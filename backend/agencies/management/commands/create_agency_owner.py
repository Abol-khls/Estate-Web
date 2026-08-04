from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError as DjangoValidationError

from agencies.models import Agency


class Command(BaseCommand):

    help = "Creates a new Agency together with its first manager account."

    def add_arguments(self, parser):

        parser.add_argument("--agency-name", required=True)
        parser.add_argument("--username", required=True)
        parser.add_argument("--password", required=True)
        parser.add_argument("--phone", default="")
        parser.add_argument("--address", default="")
        parser.add_argument(
            "--force",
            action="store_true",
            help="Allow creating another Agency even if one already exists."
        )

    def handle(self, *args, **options):

        User = get_user_model()

        if Agency.objects.exists() and not options["force"]:
            raise CommandError(
                "An agency already exists on this installation. This "
                "command is designed for single-agency deployments. If "
                "you really want to create a second agency, run it again "
                "with --force."
            )

        if User.objects.filter(username=options["username"]).exists():
            raise CommandError("This username is already taken.")

        try:
            validate_password(options["password"])
        except DjangoValidationError as error:
            raise CommandError(" ".join(error.messages))

        agency = Agency.objects.create(
            name=options["agency_name"],
            phone=options["phone"],
            address=options["address"],
        )

        User.objects.create_superuser(
            username=options["username"],
            password=options["password"],
            role="manager",
            agency=agency,
        )

        self.stdout.write(
            self.style.SUCCESS(
                "Agency \"%s\" and manager account \"%s\" were created successfully."
                % (agency.name, options["username"])
            )
        )