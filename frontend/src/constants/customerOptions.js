export const REQUEST_TYPES = [
    { value: "buy", label: "خرید" },
    { value: "rent", label: "اجاره" },
    { value: "sell", label: "فروش" },
    { value: "mortgage", label: "رهن" },
];

export const CUSTOMER_ORDERING_OPTIONS = [
    { value: "-created_at", label: "جدیدترین" },
    { value: "created_at", label: "قدیمی‌ترین" },
    { value: "-budget", label: "بیشترین بودجه" },
    { value: "budget", label: "کمترین بودجه" },
];

export const CUSTOMER_STATUSES = [
    { value: "active", label: "فعال" },
    { value: "converted", label: "قطعی شده" },
    { value: "inactive", label: "غیرفعال" },
];

export function getCustomerStatusLabel(value) {
    return CUSTOMER_STATUSES.find(item => item.value === value)?.label ?? value;
}

export function getCustomerStatusColor(value) {
    if (value === "active") return "info";
    if (value === "converted") return "success";
    if (value === "inactive") return "default";
    return "default";
}

export function getRequestTypeLabel(value) {
    return REQUEST_TYPES.find(item => item.value === value)?.label ?? value;
}