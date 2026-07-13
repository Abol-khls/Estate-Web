export const ACTIVITY_STATUSES = [
    { value: "pending", label: "در انتظار" },
    { value: "done", label: "انجام‌شده" },
    { value: "cancelled", label: "لغو شده" },
];

export const ACTIVITY_ORDERING_OPTIONS = [
    { value: "-follow_date", label: "نزدیک‌ترین پیگیری" },
    { value: "follow_date", label: "دورترین پیگیری" },
    { value: "-created_at", label: "جدیدترین ثبت‌شده" },
    { value: "created_at", label: "قدیمی‌ترین ثبت‌شده" },
];

export function getActivityStatusLabel(value) {
    return ACTIVITY_STATUSES.find(item => item.value === value)?.label ?? value;
}

export function getActivityStatusColor(value) {
    if (value === "pending") return "info";
    if (value === "done") return "success";
    if (value === "cancelled") return "error";
    return "default";
}