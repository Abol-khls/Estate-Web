import os
from io import BytesIO

import arabic_reshaper
from bidi.algorithm import get_display

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (
    SimpleDocTemplate,
    Table,
    TableStyle,
    Paragraph,
    Spacer,
)
from reportlab.lib.styles import ParagraphStyle

FONTS_DIR = os.path.join(os.path.dirname(__file__), "fonts")

pdfmetrics.registerFont(
    TTFont("Vazirmatn", os.path.join(FONTS_DIR, "Vazirmatn-Regular.ttf"))
)

pdfmetrics.registerFont(
    TTFont("Vazirmatn-Bold", os.path.join(FONTS_DIR, "Vazirmatn-Bold.ttf"))
)

PRIMARY_COLOR = colors.HexColor("#A2712A")
LIGHT_ROW_COLOR = colors.HexColor("#F2F0E9")

PROPERTY_TYPE_LABELS = {
    'apartment': 'آپارتمان',
    'villa': 'ویلا',
    'land': 'زمین',
    'office': 'اداری',
    'shop': 'مغازه',
}

REQUEST_TYPE_LABELS = {
    'buy': 'خرید',
    'rent': 'اجاره',
    'sell': 'فروش',
    'mortgage': 'رهن',
}


def rtl(text):

    reshaped = arabic_reshaper.reshape(str(text))

    return get_display(reshaped)


def _title_style():

    return ParagraphStyle(
        name="TitleFa",
        fontName="Vazirmatn-Bold",
        fontSize=16,
        textColor=PRIMARY_COLOR,
        alignment=1,
        spaceAfter=6,
    )


def _section_style():

    return ParagraphStyle(
        name="SectionFa",
        fontName="Vazirmatn-Bold",
        fontSize=13,
        textColor=PRIMARY_COLOR,
        alignment=2,
        spaceBefore=14,
        spaceAfter=8,
    )


def _subtitle_style():

    return ParagraphStyle(
        name="SubtitleFa",
        fontName="Vazirmatn",
        fontSize=10,
        textColor=colors.grey,
        alignment=1,
        spaceAfter=14,
    )


def _contains_persian(text):

    return any('\u0600' <= ch <= '\u06FF' for ch in text)


def _format_cell(value):

    text = str(value)

    if _contains_persian(text):
        return rtl(text)

    return text


def _make_table(headers, rows):

    data = [[rtl(h) for h in headers]] + [
        [_format_cell(cell) for cell in row]
        for row in rows
    ]

    table = Table(data, hAlign="CENTER", repeatRows=1)

    style = [
        ("FONTNAME", (0, 0), (-1, -1), "Vazirmatn"),
        ("FONTNAME", (0, 0), (-1, 0), "Vazirmatn-Bold"),
        ("BACKGROUND", (0, 0), (-1, 0), PRIMARY_COLOR),
        ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
        ("FONTSIZE", (0, 0), (-1, -1), 9),
        ("ALIGN", (0, 0), (-1, -1), "CENTER"),
        ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
        ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#DDDDDD")),
        ("TOPPADDING", (0, 0), (-1, -1), 6),
        ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
    ]

    for i in range(1, len(data)):

        if i % 2 == 0:
            style.append(("BACKGROUND", (0, i), (-1, i), LIGHT_ROW_COLOR))

    table.setStyle(TableStyle(style))

    return table


def build_report_pdf(report_data, agency, start_date, end_date):

    buffer = BytesIO()

    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        topMargin=18 * mm,
        bottomMargin=18 * mm,
        leftMargin=16 * mm,
        rightMargin=16 * mm,
    )

    elements = []

    elements.append(Paragraph(rtl(agency.name if agency else "گزارش عملکرد"), _title_style()))

    elements.append(Paragraph(
        rtl(f"بازه‌ی زمانی: {start_date} تا {end_date}"),
        _subtitle_style()
    ))

    elements.append(Paragraph(rtl("فروش و اجاره ماهانه"), _section_style()))

    sales_rows = [
        [
            row['month'],
            row['sale_count'],
            f"{row['sale_amount']:,}",
            row['rent_count'],
            f"{row['rent_amount']:,}",
        ]
        for row in report_data['sales']
    ] or [["—", "—", "—", "—", "—"]]

    elements.append(_make_table(
        ["ماه", "تعداد فروش", "مبلغ فروش", "تعداد اجاره", "مبلغ اجاره"],
        sales_rows
    ))

    elements.append(Paragraph(rtl("عملکرد مشاوران"), _section_style()))

    agent_rows = [
        [
            row['agent_name'],
            row['visits_count'],
            row['contracts_count'],
            f"{row['contracts_amount']:,}",
        ]
        for row in report_data['agents']
    ] or [["—", "—", "—", "—"]]

    elements.append(_make_table(
        ["نام مشاور", "تعداد بازدید", "تعداد قرارداد", "مبلغ کل قراردادها"],
        agent_rows
    ))

    elements.append(Paragraph(rtl("آمار مشتریان"), _section_style()))

    customers = report_data['customers']

    customer_rows = [
        ["تعداد کل مشتریان", customers['total']],
        ["تبدیل‌شده به مشتری قطعی", customers['converted']],
        ["نرخ تبدیل (٪)", customers['conversion_rate']],
    ]

    for row in customers['by_request_type']:

        label = REQUEST_TYPE_LABELS.get(row['request_type'], row['request_type'])

        customer_rows.append([f"درخواست {label}", row['count']])

    elements.append(_make_table(
        ["شاخص", "مقدار"],
        customer_rows
    ))

    elements.append(Paragraph(rtl("میانگین قیمت ملک"), _section_style()))

    price_rows = [
        [
            PROPERTY_TYPE_LABELS.get(row['property_type'], row['property_type']),
            row['count'],
            f"{row['avg_price']:,}",
            row['avg_area'],
        ]
        for row in report_data['property_prices']
    ] or [["—", "—", "—", "—"]]

    elements.append(_make_table(
        ["نوع ملک", "تعداد", "میانگین قیمت", "میانگین متراژ"],
        price_rows
    ))

    doc.build(elements)

    buffer.seek(0)

    return buffer