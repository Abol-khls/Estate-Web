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

export function getRequestTypeLabel(value) {
    return REQUEST_TYPES.find(item => item.value === value)?.label ?? value;
}