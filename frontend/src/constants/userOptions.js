export const USER_ROLES = [
    { value: "manager", label: "مدیر آژانس" },
    { value: "agent", label: "مشاور" },
];

export function getRoleLabel(value) {
    return USER_ROLES.find(item => item.value === value)?.label ?? value;
}

export function getRoleColor(value) {
    if (value === "manager") return "primary";
    if (value === "agent") return "info";
    return "default";
}