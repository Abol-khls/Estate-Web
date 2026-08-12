export const PROPERTY_TYPES = [
    { value: "apartment", label: "آپارتمان" },
    { value: "villa", label: "ویلا" },
    { value: "land", label: "زمین" },
    { value: "office", label: "دفتر" },
    { value: "shop", label: "مغازه" },
    { value: "suite", label: "سوئیت" },
];

export const TRANSACTION_TYPES = [
    { value: "sale", label: "فروش" },
    { value: "rent", label: "اجاره" },
    { value: "mortgage", label: "رهن" },
];

export const PROPERTY_STATUSES = [
    { value: "available", label: "در حال فروش" },
    { value: "reserved", label: "رزرو شده" },
    { value: "sold", label: "فروخته شده" },
];

export function getPropertyStatusLabel(value) {
    return PROPERTY_STATUSES.find(item => item.value === value)?.label ?? value;
}

export function getPropertyStatusColor(value) {
    if (value === "available") return "info";
    if (value === "reserved") return "warning";
    if (value === "sold") return "success";
    return "default";
}

export function getTransactionTypeColor(value) {
    if (value === "sale") return "primary";
    if (value === "rent") return "secondary";
    if (value === "mortgage") return "warning";
    return "default";
}

export function isRentTransaction(value) {
    return value === "rent";
}

export const ORDERING_OPTIONS = [
    
    {
        value: "-created_at",
        label: "جدیدترین"
    },
    {
        value: "created_at",
        label: "قدیمی‌ترین"
    },
    {
        value: "-price",
        label: "گران‌ترین"
    },
    {
        value: "price",
        label: "ارزان‌ترین"
    },
    {
        value: "-area",
        label: "بیشترین متراژ"
    },
    {
        value: "area",
        label: "کمترین متراژ"
    }
];