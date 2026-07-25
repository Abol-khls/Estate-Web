from django.db.models import Count, Sum, Avg, Q
from django.db.models.functions import TruncMonth

from customers.models import Customer
from contracts.models import Contract
from visits.models import Visit
from properties.models import Property
from users.models import User


def get_sales_report(agency, start_date, end_date):

    contracts = Contract.objects.filter(
        agency=agency,
        status='signed',
        created_at__date__gte=start_date,
        created_at__date__lte=end_date,
    )

    monthly = contracts.annotate(
        month=TruncMonth('created_at')
    ).values(
        'month',
        'contract_type'
    ).annotate(
        count=Count('id'),
        total_amount=Sum('amount')
    ).order_by('month')

    result = {}

    for row in monthly:

        key = row['month'].strftime('%Y-%m')

        if key not in result:

            result[key] = {
                'month': key,
                'sale_count': 0,
                'sale_amount': 0,
                'rent_count': 0,
                'rent_amount': 0,
            }

        if row['contract_type'] == 'sale':
            result[key]['sale_count'] = row['count']
            result[key]['sale_amount'] = row['total_amount'] or 0

        elif row['contract_type'] == 'rent':
            result[key]['rent_count'] = row['count']
            result[key]['rent_amount'] = row['total_amount'] or 0

    return sorted(result.values(), key=lambda item: item['month'])


def get_agent_performance(agency, start_date, end_date):

    agents = list(User.objects.filter(
        agency=agency,
        role__in=['agent', 'manager']
    ))

    visits_by_agent = dict(
        Visit.objects.filter(
            agent__in=agents,
            visit_date__date__gte=start_date,
            visit_date__date__lte=end_date,
        ).values('agent').annotate(
            count=Count('id')
        ).values_list('agent', 'count')
    )

    contracts_by_agent = {
        row['agent']: row
        for row in Contract.objects.filter(
            agent__in=agents,
            status='signed',
            created_at__date__gte=start_date,
            created_at__date__lte=end_date,
        ).values('agent').annotate(
            count=Count('id'),
            total=Sum('amount')
        )
    }

    data = []

    for agent in agents:

        contracts_row = contracts_by_agent.get(agent.id, {})

        data.append({
            'agent_id': agent.id,
            'agent_name': (
                f"{agent.first_name} {agent.last_name}".strip()
                or agent.username
            ),
            'visits_count': visits_by_agent.get(agent.id, 0),
            'contracts_count': contracts_row.get('count', 0),
            'contracts_amount': contracts_row.get('total') or 0,
        })

    data.sort(key=lambda item: item['contracts_amount'], reverse=True)

    return data


def get_customer_stats(agency, start_date, end_date):

    customers = Customer.objects.filter(
        agency=agency,
        created_at__date__gte=start_date,
        created_at__date__lte=end_date,
    )

    total = customers.count()

    converted = customers.filter(status='converted').count()

    conversion_rate = round((converted / total) * 100, 1) if total else 0

    by_request_type = list(
        customers.values('request_type').annotate(
            count=Count('id')
        ).order_by('-count')
    )

    return {
        'total': total,
        'converted': converted,
        'conversion_rate': conversion_rate,
        'by_request_type': by_request_type,
    }


def get_property_price_stats(agency):

    properties = Property.objects.filter(agency=agency)

    stats = list(
        properties.values('property_type').annotate(
            count=Count('id'),
            avg_price=Avg('price'),
            avg_area=Avg('area'),
        ).order_by('-count')
    )

    for row in stats:

        row['avg_price'] = round(row['avg_price'] or 0)
        row['avg_area'] = round(row['avg_area'] or 0, 1)

    return stats


def get_full_report(agency, start_date, end_date):

    return {
        'sales': get_sales_report(agency, start_date, end_date),
        'agents': get_agent_performance(agency, start_date, end_date),
        'customers': get_customer_stats(agency, start_date, end_date),
        'property_prices': get_property_price_stats(agency),
    }