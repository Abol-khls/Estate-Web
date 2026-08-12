from django.db import migrations


def forwards(apps, schema_editor):

    Property = apps.get_model('properties', 'Property')

    Property.objects.filter(
        transaction_type='pre_sale'
    ).update(
        transaction_type='sale'
    )

    Property.objects.filter(
        status='rented'
    ).update(
        status='sold'
    )


def backwards(apps, schema_editor):
    pass


class Migration(migrations.Migration):

    dependencies = [
        ('properties', '0012_property_deposit_amount_property_monthly_rent_and_more'),
    ]

    operations = [
        migrations.RunPython(forwards, backwards),
    ]