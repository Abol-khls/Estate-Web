export const PROPERTY_TYPES = [
    { value: "apartment", label: "آپارتمان" },
    { value: "villa", label: "ویلا" },
    { value: "land", label: "زمین" },
    { value: "office", label: "دفتر" },
    { value: "shop", label: "مغازه" },
];

export const TRANSACTION_TYPES = [
    { value: "sale", label: "فروش" },
    { value: "rent", label: "اجاره" },
    { value: "mortgage", label: "رهن" },
    { value: "pre_sale", label: "پیش فروش" },
];

export const PROPERTY_STATUSES = [
    { value: "available", label: "در حال فروش" },
    { value: "reserved", label: "رزرو شده" },
    { value: "sold", label: "فروخته شده" },
    { value: "rented", label: "اجاره داده شده" },
];

export function getPropertyStatusLabel(value) {
    return PROPERTY_STATUSES.find(item => item.value === value)?.label ?? value;
}

export function getPropertyStatusColor(value) {
    if (value === "available") return "info";
    if (value === "reserved") return "warning";
    if (value === "sold") return "success";
    if (value === "rented") return "success";
    return "default";
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