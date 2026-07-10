export const CONTRACT_TYPES = [
    { value: "sale", label: "فروش" },
    { value: "rent", label: "اجاره" },
    { value: "mortgage", label: "رهن" },
];

export const CONTRACT_STATUSES = [
    { value: "draft", label: "پیش‌نویس" },
    { value: "signed", label: "امضا شده" },
    { value: "cancelled", label: "لغو شده" },
];

export const CONTRACT_ORDERING_OPTIONS = [
    { value: "-created_at", label: "جدیدترین" },
    { value: "created_at", label: "قدیمی‌ترین" },
    { value: "-amount", label: "بیشترین مبلغ" },
    { value: "amount", label: "کمترین مبلغ" },
];

export function getContractTypeLabel(value) {
    return CONTRACT_TYPES.find(item => item.value === value)?.label ?? value;
}

export function getContractStatusLabel(value) {
    return CONTRACT_STATUSES.find(item => item.value === value)?.label ?? value;
}

export function getContractStatusColor(value) {
    if (value === "draft") return "default";
    if (value === "signed") return "success";
    if (value === "cancelled") return "error";
    return "default";
}