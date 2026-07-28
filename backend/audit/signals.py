from django.db.models.signals import post_save, post_delete
from django.dispatch import receiver

from properties.models import Property
from customers.models import Customer
from visits.models import Visit
from contracts.models import Contract
from activities.models import Activity
from users.models import User

from .models import AuditLog
from .request_context import get_current_actor


def _write_log(instance, action):

    AuditLog.objects.create(
        actor=get_current_actor(),
        agency=getattr(instance, 'agency', None),
        action=action,
        model_name=instance._meta.model_name,
        object_id=str(instance.pk),
        object_repr=str(instance)[:255],
    )


@receiver(post_save, sender=Property)
@receiver(post_save, sender=Customer)
@receiver(post_save, sender=Visit)
@receiver(post_save, sender=Contract)
@receiver(post_save, sender=Activity)
@receiver(post_save, sender=User)
def handle_save(sender, instance, created, **kwargs):

    _write_log(instance, 'create' if created else 'update')


@receiver(post_delete, sender=Property)
@receiver(post_delete, sender=Customer)
@receiver(post_delete, sender=Visit)
@receiver(post_delete, sender=Contract)
@receiver(post_delete, sender=Activity)
@receiver(post_delete, sender=User)
def handle_delete(sender, instance, **kwargs):

    _write_log(instance, 'delete')