from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth import get_user_model

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
                "یک آژانس از قبل روی این نصب وجود دارد. این دستور برای "
                "دیپلوی تک‌بنگاهی طراحی شده است. اگر واقعاً می‌خواهید یک "
                "آژانس دوم بسازید، دوباره با --force اجرا کنید."
            )

        if User.objects.filter(username=options["username"]).exists():
            raise CommandError("این نام کاربری قبلاً استفاده شده است.")

        if len(options["password"]) < 8:
            raise CommandError("رمز عبور باید حداقل ۸ کاراکتر باشد.")

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
                "آژانس \"%s\" و حساب مدیر \"%s\" با موفقیت ساخته شد."
                % (agency.name, options["username"])
            )
        )