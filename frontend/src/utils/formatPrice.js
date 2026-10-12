function trim(value) {

    return Number(value.toFixed(2)).toString();

}

export function formatToman(value, withUnit = true) {

    const amount = Number(value || 0);

    const suffix = withUnit ? " تومان" : "";

    if (amount >= 1e9) return `${trim(amount / 1e9)} میلیارد${suffix}`;

    if (amount >= 1e6) return `${trim(amount / 1e6)} میلیون${suffix}`;

    return `${amount.toLocaleString("en-US")}${suffix}`;

}

export function getPriceText(property) {

    if (property.transaction_type === "rent") {
        return `${formatToman(property.deposit_amount, false)} ودیعه / ${formatToman(property.monthly_rent, false)} اجاره`;
    }

    if (property.transaction_type === "mortgage") {
        return `${formatToman(property.price)} رهن`;
    }

    return formatToman(property.price);

}