export const VISIT_STATUSES = [
    { value: "scheduled", label: "برنامه‌ریزی‌شده" },
    { value: "completed", label: "انجام‌شده" },
    { value: "cancelled", label: "لغو شده" },
];

export const VISIT_ORDERING_OPTIONS = [
    { value: "-visit_date", label: "نزدیک‌ترین بازدید" },
    { value: "visit_date", label: "دورترین بازدید" },
    { value: "-created_at", label: "جدیدترین ثبت‌شده" },
    { value: "created_at", label: "قدیمی‌ترین ثبت‌شده" },
];

export function getVisitStatusLabel(value) {
    return VISIT_STATUSES.find(item => item.value === value)?.label ?? value;
}

export function getVisitStatusColor(value) {
    if (value === "scheduled") return "info";
    if (value === "completed") return "success";
    if (value === "cancelled") return "error";
    return "default";
}